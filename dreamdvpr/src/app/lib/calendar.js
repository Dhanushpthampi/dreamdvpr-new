// lib/calendar.js
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL || "http://localhost:3000"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const calendar = google.calendar({ version: "v3", auth: oauth2Client });

/**
 * Creates a Google Calendar event with a Google Meet link
 * @param {Object} eventDetails 
 * @param {string} eventDetails.summary
 * @param {string} eventDetails.description
 * @param {Date} eventDetails.startTime
 * @param {number} eventDetails.duration (minutes)
 * @param {string} eventDetails.userEmail
 */
export async function createMeeting({ summary, description, startTime, duration = 60, userEmail }) {
    try {
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const event = {
            summary: summary || 'REDgravity Strategy Meeting',
            description: description || 'Project strategy discussion',
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'UTC',
            },
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            attendees: [
                { email: userEmail },
            ],
        };

        const res = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        return {
            id: res.data.id,
            htmlLink: res.data.htmlLink,
            meetLink: res.data.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri,
        };
    } catch (error) {
        console.error("Error creating calendar event:", error);
        throw error;
    }
}
