module.exports = {
  namespace: 'inbox',
  state: {
    messages: [
      {
        id: 1,
        subject: 'Welcome to Choo',
        from: 'choochoo@choojs.com',
        to: 'user@example.com',
        date: new Date(),
        body: 'Welcome to Choo. We hope you enjoy your stay'
      }, {
        id: 2,
        subject: 'Great Choo Resources',
        from: 'choochoo@choojs.com',
        to: 'user@example.com',
        date: new Date(),
        body: 'Have you seen choocasts.com? How about chooaddons.com?'
      }
    ]
  },
  reducers: { }
}
