module.exports = {
  namespace: 'sent',
  state: {
    messages: [
      {
        id: 4,
        subject: 'Should I use Choo',
        from: 'user@example.com',
        to: 'choochoo@choojs.com',
        date: new Date(),
        body: 'Choo looks pretty good, should I use it?'
      }
    ]
  },
  reducers: { }
}
