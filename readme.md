Small express app that uses request to pull stats for some people using BF4...  
Jade templating engine used to output html with embedded twitch stream for each user.  
Mongo backend to keep track of stats so I can start doing cool stuff with it.  

ToDo:
- [x] Move from bf4stats.com to battlelog so I can query updates as often as I want
- [x] Procedurely generate each user card, instead of how it's done statically currently
- [x] Move users to database
- [x] Add update buttons to cards, so that users can update their stats whenever they want
- [ ] Find a way to query online status so I can put an online indicator on each user
- [ ] Charts?
- [ ] Day over day stats changes
- [ ] Comparison from day to day