// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  res.json({
    subject: "acct:nirmalhk7@mstdn.social",
    aliases: [
      "https://mstdn.social/@nirmalhk7",
      "https://mstdn.social/users/nirmalhk7"
    ],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: "https://mstdn.social/@nirmalhk7"
      },
      {
        rel: "self",
        type: "application/activity+json",
        href: "https://mstdn.social/users/nirmalhk7"
      },
      {
        rel: "http://ostatus.org/schema/1.0/subscribe",
        template: "https://mstdn.social/authorize_interaction?uri={uri}"
      }
    ]
  });
}