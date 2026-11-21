const receivedDate = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
});

export function contactMessage(fields, received = new Date()) {
  const name = String(fields.get('user_name') ?? '').trim();
  const email = String(fields.get('user_email') ?? '').trim();
  const subject = String(fields.get('subject') ?? '').trim() || 'Portfolio inquiry';
  const body = String(fields.get('message') ?? '').trim();
  const timestamp = `${receivedDate.format(received)} IST`;

  return {
    user_name: name,
    user_email: email,
    subject,
    timestamp,
    message: [`From: ${name}`, `Reply to: ${email}`, `Subject: ${subject}`, `Received: ${timestamp}`, '', body].join('\n'),
  };
}
