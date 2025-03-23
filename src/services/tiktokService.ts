import { parse } from 'node-html-parser';
import { CheckAliveResponse, LiveRoomData, StreamURLResponse } from '../interfaces/interfaces';
import { TIKTOK_CHECK_ALIVE_URL, TIKTOK_LIVE_URL, TIKTOK_REGION, TIKTOK_ROOM_INFO_URL } from '../constants/appConstants';
import { fetchJSON, fetchSite } from '../utils/fetchUtils';
import { logger } from '../logger';

/**
 * @param roomID Live room ID
 * @returns A boolean indicating if user is live.
 */
export async function checkIfLive(roomID: number): Promise<boolean> {
  const response = await fetchJSON<CheckAliveResponse>(TIKTOK_CHECK_ALIVE_URL(roomID));
  return response.data[0]?.alive ?? false;
}

/**
 * @param roomID Live room ID
 * @returns An array of stream urls.
 */
export async function getStreamURL(roomID: number): Promise<string[]> {
  const response = await fetchJSON<StreamURLResponse>(TIKTOK_ROOM_INFO_URL(roomID));
  
  if (response.status_code != 0) {
    throw new Error(`Failed to fetch room info with status code ${response.status_code}`);
  }
  
  logger.info("Stream URLs: " + JSON.stringify(response.data.stream_url.flv_pull_url));
  return Object.values(response.data.stream_url.flv_pull_url || {});
}

/**
 * @param username Tiktok username
 * @returns RoomID or null if not found
 */
export async function getRoomID(username: string): Promise<number | null> {
  const html: string = await fetchSite(TIKTOK_LIVE_URL(username));

  const doc = parse(html);

  const scriptTag = doc.getElementById("SIGI_STATE");
  if (!scriptTag) throw new Error("Failed to find script tag")

  const jsonString: string | null = scriptTag.textContent;
  if (!jsonString) throw new Error("Script tag content is empty")

  const json: LiveRoomData = JSON.parse(jsonString);
  const roomID = json.LiveRoom.liveRoomUserInfo?.user?.roomId;

  logger.info("RoomID: " + roomID)

  return roomID ?? null;
}

/**
 * Checks if user is blacklisted if fetch gets redirected from live.
 * @param username Tiktok username
 * @returns boolean indicating if the user is blacklisted
 */
export async function checkIfBlacklisted(username: string): Promise<boolean> {
  const response = await fetch(`https://www.tiktok.com/@${username}/live?region=${TIKTOK_REGION}`);
  return response.redirected;
}