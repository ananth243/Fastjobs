import { calendar_v3, google } from "googleapis";
import { oauthClient } from "./auth";

function getRequestId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function makeCalendarAppointment(
  bookerEmail: string,
  bookerName: string,
  hostEmail: string,
  hostName: string,
  startDate: Date,
  endDate: Date,
  refresh_token: string
) {
  try {
    oauthClient.setCredentials({ refresh_token });
    oauthClient.refreshAccessToken();
    const calendar = google.calendar({ version: "v3", auth: oauthClient });
    calendar.events.insert(
      {
        auth: oauthClient,
        calendarId: "primary",
        requestBody: {
          attendees: [
            {
              email: hostEmail,
            },
          ],
          start: {
            dateTime: startDate.toString(),
          },
          end: {
            dateTime: endDate.toString(),
          },
          summary: `Meeting between ${hostName} and ${bookerName}`,
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
              requestId: getRequestId(10),
            },
          },
        },
      },
      (err, event) => {
        if (err) throw err;
        console.log(event);
      }
    );
  } catch (error) {
    console.error(error);
  }
}
