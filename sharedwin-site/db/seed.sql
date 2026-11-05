-- Demo matches (kickoff in the near future). Run with: npm run db:seed
insert into matches (sport, league, home, away, kickoff_at) values
 ('Football','Ligue 1','PSG','Marseille', now() + interval '3 hours'),
 ('Football','Premier League','Arsenal','Man City', now() + interval '1 day'),
 ('Rugby','Six Nations','France','England', now() + interval '2 days'),
 ('Hockey','NHL (regulation)','Bruins','Rangers', now() + interval '2 days 4 hours'),
 ('Football','La Liga','Real Madrid','Barcelona', now() + interval '3 days'),
 ('Football','Serie A','Inter','Juventus', now() + interval '4 days');
