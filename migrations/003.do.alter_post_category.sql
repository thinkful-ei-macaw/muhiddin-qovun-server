CREATE TYPE post_category AS ENUM ( 
  'Other',
  'Jobs',
  'Apartments',
  'Cars',
  'Events'
);                  

ALTER TABLE posts
  ADD COLUMN
    section post_category;


