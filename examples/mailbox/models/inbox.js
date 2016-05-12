module.exports = {
  state: {
    messages: [
      {
        id: 1,
        subject: 'Welcome to Ember',
        from: 'tomster@emberjs.com',
        to: 'user@example.com',
        date: new Date(),
        body: 'Welcome to Ember. We hope you enjoy your stay'
      }, {
        id: 2,
        subject: 'Great Ember Resources',
        from: 'tomster@emberjs.com',
        to: 'user@example.com',
        date: new Date(),
        body: 'Have you seen embercasts.com? How about emberaddons.com?'
      }
    ]
  },
  reducers: { }
}
