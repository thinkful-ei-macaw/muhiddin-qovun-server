BEGIN;

INSERT INTO users (user_id, user_name, full_name, email, password)
VALUES 
  (1, 'user', 'User Name', 'user@example.com', '$2a$12$cVeeKwB/tGVpOocvvpojDOvT8TN.H8TN7l3AB.XgHXz24zsBXOIOy'),
  (2, 'john', 'John Doe', 'johndoe@aol.com', '$2a$12$VnPdsR07nV5lQ0rxZkd31OGE9EDJPQgMqHgR3nI9DuLLu3iDd8uaq');

INSERT INTO posts (title, content, section, user_id)
VALUES
  ('Full Stack Web Developer', 'We are looking for a full stack web developer who has 1+ years of 
  job experience in ReactJS, PostgreSQL, Express and NodeJS. Contact us at https://www.thinkful.com', 'Jobs', 1),
  ('Front End Engineer', 'Uber HQ is hiring for Front End Developer role who has at least 6 months of
  experience in ReactJS and NodeJS. Contact us at 415-555-5555 for more detail', 'Jobs', 2),
  ('1 bedroom apartment in Marina district', '1-bed-apt in Marina dis. available Apr 1st, Call 415-999-9999', 'Apartments', 1),
  ('A studio in Financial District', 'A studio available on Apr 5 in FiDi, email: someone@example.com', 'Apartments', 2),
  ('2020 BMW m3 $40k', '2020 bmw m3 for sale in SF. $40k final. For details call me at 415-333-3333', 'Cars', 1),
  ('2016 Toyota Camry $30k', '2016 Toyota Camry Hybrid for sale in Oakland. Price: $20,600. For details text me at 415-333-3333', 'Cars', 1),
  ('Free TV', 'Free samsung smart tv 55 - 4k tv. Call 415-333-3333, if interested', 'Other', 2),
  ('One master bedroom for rent', 'Master bedroom available in Outer Richmond on May 1st. $1000 deposit plus first
and last month, total: $2,600', 'Other', 1),
('$3808 4-8 weeks FREE for this 1 bedroom with AMAZING natural sunlight!', 'This is a 1 Bedroom, 1 Bath, approximately 689-741 Sq. Ft.

Welcome to Savoy in Sunnyvale, within the heart of the Silicon Valley. 
Focusing on the naturally occurring patterns found in nature, Savoys aesthetic is clean, minimal, and welcoming; a perfect fusion of the areas history as a pastoral landscape and its current state as a booming tech hub.',
'Apartments', 2),
('$4000 / 2br - 950ft2 - Modern Condo - 2Br/2Ba with Rooftop (SOMA / south beach)', 'Condo features:
- 2 large size bedrooms with large closets, 2 full bathrooms
- Bay windows throughout condo providing ample natural sunlight
- Updated kitchen with stainless steel appliances, granite counters, breakfast bar
- Balcony and rooftop access off master bedroom
- Hardwood floors on each floor and in rooms
- In-wall heating in each room
- Free washer and dryer in-buidling
- One car parking spot (additional $300/month)', 'Apartments', 1),
('Uzbek Food Festival[Central Asian Food Festival]', 'On 7/18/2020 Uzbek Food Festival is planned to be held in Chicago, IL.', 'Events', 1),
('Nowruz Holiday Celebration', 'Navruz 2019 and UCC opening Celebration, March 25 2019', 'Events', 2);
ALTER SEQUENCE users_user_id_seq RESTART WITH 3;

COMMIT;
