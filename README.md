# Recommendation System v2

## About

### Structure

#### Platform

- NodeJs

- MongoDB

- Typescript

#### Library

- xlsx

- express



### Author

- Lam Vo Hoang 15520412

- HTCL2015, University of Information Technology

- Contact: +84 944 99 44 34

- Email: 15520412@gm.uit.edu.vn - vhlam1997@gmail.com

### Description

- See you soon !


## Data

- Raw data: `http://insideairbnb.com/amsterdam/`

- DB on Mongodb Cloud: `mongodb+srv://<user>:<password>@rs-cb-noxe8.gcp.mongodb.net/<database-name>?retryWrites=true&w=majority`

## Data Structure

1. listings: 19700 documents

2. neighborhoods: 22 documents

3. reviews: 494880 documents

4. reviewsDetail: 494880 documents

5. listingsDetail: 19700 documents

6. calendarDetail: 1048575 documents

### listings

- id

- name

- host_id

- host_name

- neighbourhood_group

- neighbourhood

- latitude

- longitude

- room_type

- price

- minimum_nights

- number_of_reviews

- last_review

- reviews_per_month

- calculated_host_listings_count

- availability_365

### neighborhoods

- neighbourhood_group

- neighbourhood

### reviews

- listing_id

- date

### reviewsDetail

- listing_id

- id

- date

- reviewer_id

- reviewer_name

- comments

### listingsDetail

- id
- listing_url
- scrape_id
- last_scraped
- name
- summary
- space
- description
- experiences_offered
- neighborhood_overview
- notes
- transit
- access
- interaction
- house_rules
- thumbnail_url
- medium_url
- picture_url
- xl_picture_url
- host_id
- host_url
- host_name
- host_since
- host_location
- host_about
- host_response_time
- host_response_rate
- host_acceptance_rate
- host_is_superhost
- host_thumbnail_url
- host_picture_url
- host_neighbourhood
- host_listings_count
- host_total_listings_count
- host_verifications
- host_has_profile_pic
- host_identity_verified
- street
- neighbourhood
- neighbourhood_cleansed
- neighbourhood_group_cleansed
- city
- state
- zipcode
- market
- smart_location
- country_code
- country
- latitude
- longitude
- is_location_exact
- property_type
- room_type
- accommodates
- bathrooms
- bedrooms
- beds
- bed_type
- amenities
- square_feet
- price
- weekly_price
- monthly_price
- security_deposit
- cleaning_fee
- guests_included
- extra_people
- minimum_nights
- maximum_nights
- minimum_minimum_nights
- maximum_minimum_nights
- minimum_maximum_nights
- maximum_maximum_nights
- minimum_nights_avg_ntm
- maximum_nights_avg_ntm
- calendar_updated
- has_availability
- availability_30
- availability_60
- availability_90
- availability_365
- calendar_last_scraped
- number_of_reviews
- number_of_reviews_ltm
- first_review
- last_review
- review_scores_rating
- review_scores_accuracy
- review_scores_cleanliness
- review_scores_checkin
- review_scores_communication
- review_scores_location
- review_scores_value
- requires_license
- license
- jurisdiction_names
- instant_bookable
- is_business_travel_ready
- cancellation_policy
- require_guest_profile_picture
- require_guest_phone_verification
- calculated_host_listings_count
- calculated_host_listings_count_entire_homes
- calculated_host_listings_count_private_rooms
- calculated_host_listings_count_shared_rooms
- reviews_per_month

### calendarDetail

- listing_id
- date
- available
- price
- adjusted_price
- minimum_nights
- maximum_nights
