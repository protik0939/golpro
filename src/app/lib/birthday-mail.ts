type BirthdayMailContent = {
  cId: string;
  cTitle: string;
  cDescription?: string;
  cContentType?: string;
  cLandscape?: string;
  cPortrait?: string;
  cBanner?: string;
  cLogo?: string;
  cCard?: string;
  cSquare?: string;
  cLink?: string;
};

type BirthdayMailAuthor = {
  fullName: string;
  email: string;
  imageUrl?: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const getContentHref = (content: BirthdayMailContent, baseUrl: string) => {
  if (content.cLink) {
    if (isAbsoluteUrl(content.cLink)) {
      return content.cLink;
    }

    if (content.cLink.startsWith('/')) {
      return `${baseUrl}${content.cLink}`;
    }
  }

  return `${baseUrl}/${content.cContentType ?? 'content'}/${content.cId}`;
};

const getPrimaryImage = (content: BirthdayMailContent) =>
  content.cLandscape || '';

const makeAbsoluteUrl = (value: string | undefined, baseUrl: string) => {
  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;
  if (value.startsWith('/')) return `${baseUrl.replace(/\/$/, '')}${value}`;
  return value;
};

export const buildBirthdayMailHtml = ({
  author,
  contents,
  baseUrl,
  siteLogoUrl,
  backgroundImageUrl,
}: {
  author: BirthdayMailAuthor;
  contents: BirthdayMailContent[];
  baseUrl: string;
  siteLogoUrl: string;
  backgroundImageUrl: string;
}) => {
  const authorImage = makeAbsoluteUrl(author.imageUrl || siteLogoUrl, baseUrl);

  const previewCards = contents
    .map((content) => {
      const href = getContentHref(content, baseUrl);
      const heroImageRaw = getPrimaryImage(content);
      const heroImage = makeAbsoluteUrl(heroImageRaw, baseUrl);
      const contentLogo = makeAbsoluteUrl(content.cLogo || siteLogoUrl, baseUrl);
      const title = escapeHtml(content.cTitle || 'Untitled content');
      const description = escapeHtml(content.cDescription || '');
      const typeLabel = escapeHtml(content.cContentType || 'content');

      return `
        <tr>
          <td style="padding:0 0 18px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #172554;border-radius:24px;overflow:hidden;background:#0b1020;box-shadow:0 14px 28px rgba(15,23,42,0.18);">
              <tr>
                <td style="padding:0;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-image:linear-gradient(180deg, rgba(4,10,24,0.15) 0%, rgba(4,10,24,0.88) 100%), url('${escapeHtml(backgroundImageUrl)}');background-size:cover;background-position:center;background-repeat:no-repeat;">
                    <tr>
                      <td style="padding:24px 22px 24px 22px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align:top;">
                              <div style="display:inline-block;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#c7d2fe;margin-bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(15,23,42,0.55);border:1px solid rgba(255,255,255,0.14);">${typeLabel}</div>
                              <div style="font-family:Arial,sans-serif;font-size:26px;line-height:1.12;font-weight:800;color:#ffffff;margin-bottom:10px;max-width:360px;">${title}</div>
                              <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#dbeafe;max-width:360px;">${description}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ${heroImage ? `
                    <tr>
                      <td style="position:relative;">
                        <a href="${escapeHtml(href)}" style="display:block;text-decoration:none;position:relative;">
                          <img src="${escapeHtml(heroImage)}" alt="${title} preview" style="display:block;width:100%;max-width:100%;height:auto;object-fit:cover;" />
                          <span style="position:absolute;right:16px;bottom:25%;display:inline-block;padding:8px;">
                            <img src="${escapeHtml(contentLogo)}" alt="${title} logo" style="display:block;width:150px;height:150px;object-fit:contain;border-radius:12px;" />
                          </span>
                        </a>
                      </td>
                    </tr>
                    ` : `
                    <tr>
                      <td style="padding:0 18px 18px 18px;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding:10px 12px;border-radius:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);">
                              <img src="${escapeHtml(contentLogo)}" alt="${title} logo" style="display:block;width:150px;height:150px;object-fit:contain;border-radius:12px;" />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `}
                    <tr>
                      <td style="padding:16px 18px 20px 18px;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="border-radius:999px;background:linear-gradient(135deg,#2563eb 0%,#60a5fa 100%);">
                              <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 18px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Tap to open</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <html>
      <body style="margin:0;padding:0;background:#f5f7fb;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">A birthday surprise from Golpo is waiting for you.</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 40px rgba(15,23,42,0.08);">
                <tr>
                  <td style="background:linear-gradient(135deg,#0b1020 0%,#111827 100%);padding:18px 18px 0 18px;color:#ffffff;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-image:linear-gradient(180deg, rgba(9,14,27,0.28) 0%, rgba(9,14,27,0.82) 100%), url('${escapeHtml(backgroundImageUrl)}');background-size:cover;background-position:center;background-repeat:no-repeat;border-radius:22px;overflow:hidden;">
                            <tr>
                                <td style="padding:26px 24px 22px 24px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td style="vertical-align:middle;">
                                        <div style="display:inline-block;vertical-align:middle;padding:8px 12px;border-radius:999px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.12);margin-bottom:14px;">
                                        <img src="${escapeHtml(siteLogoUrl)}" alt="Golpo" style="display:inline-block;width:22px;height:22px;vertical-align:middle;object-fit:contain;margin-right:8px;border-radius:6px;" />
                                        <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#e0f2fe;vertical-align:middle;">Golpo</span>
                                      </div>
                                        <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#93c5fd;margin-bottom:6px;">Happy Birthday</div>
                                        ${authorImage ? `<img src="${escapeHtml(authorImage)}" alt="${escapeHtml(author.fullName)}" style="display:inline-block;width:96px;height:96px;object-fit:cover;border-radius:12px;margin:8px 0;" />` : ''}
                                        <div style="font-family:Arial,sans-serif;font-size:32px;line-height:1.12;font-weight:800;margin-bottom:10px;max-width:560px;">Hi ${escapeHtml(author.fullName)}</div>
                                        <div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.75;color:#dbeafe;max-width:560px;">Golpo picked a few stories and audio titles that match the contents you were included with. Open any card to jump straight into it.</div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 10px 28px;">
                    <div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#111827;margin-bottom:20px;">Wishing you a beautiful day and a year filled with good stories.</div>
                    ${contents.length > 0 ? `
                      <div style="font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-bottom:14px;">Your related contents</div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${previewCards}
                      </table>
                    ` : `
                      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#4b5563;padding:18px;border:1px dashed #cbd5e1;border-radius:18px;">We could not find any content linked to your author profile yet, but we still wanted to send a birthday note from Golpo.</div>
                    `}
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:4px;">
                      <tr>
                        <td style="padding:14px 16px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:44px;vertical-align:middle;">
                                <img src="${escapeHtml(siteLogoUrl)}" alt="Golpo" style="display:block;width:40px;height:40px;object-fit:contain;border-radius:12px;" />
                              </td>
                              <td style="vertical-align:middle;padding-left:12px;">
                                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#111827;margin-bottom:2px;">Golpo</div>
                                <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">If a button does not work, copy and paste the link into your browser. This message was sent automatically from Golpo.</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#6b7280;text-align:center;padding-top:12px;">
                      This email was sent by Golpo to celebrate your birthday and highlight related works.
                    </div>
                    <div style="text-align:center;padding-top:12px;">
                      <a href="${baseUrl}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;">Visit GolPro</a>
                    </div>
                    <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#94a3b8;text-align:center;padding-top:8px;">
                      © 2026 Golpo. Built with love for readers, listeners, and creators.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const buildBirthdayMailText = ({
  author,
  contents,
  baseUrl,
}: {
  author: BirthdayMailAuthor;
  contents: BirthdayMailContent[];
  baseUrl: string;
}) => {
  const lines = [
    `Happy Birthday, ${author.fullName}!`,
    '',
    'GolPro picked a few related contents for you:',
    author.imageUrl ? `Author image: ${author.imageUrl}` : '',
    ...contents.map((content) => `- ${content.cTitle} -> ${getContentHref(content, baseUrl)}`),
    '',
    'Tap the links above to open each title.',
    '',
    'This email was sent by Golpo to celebrate your birthday and highlight related works.',
  ];

  return lines.join('\n');
};