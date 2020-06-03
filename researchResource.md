# Problem

- Gợi ý theo tính từ, chủ nhà, do tính từ bị lặp lại nhiều (amazing, airbnb, greate, experience, ....)

- Tốc độ train data chậm

- Bị trùng lại homestay cũ

- Không thể chạy trên heroku do process quá nặng

- 20k-50k documents

- Chuyển sang lọc cộng tác

- Lọc, đánh giá dữ liệu

- SAI: đánh giá nội dung

- Độ chính xác 90-95%

- Website hiển thị, demo user

- Đánh giá độ phức tạp

- Không cần tối ưu thuật toán

- Mỗi người đánh giá bao nhiêu lần

- Matrix homestay - user


## Need to do

- Algorithm to check correct of data

- Classified before run recommend

- Optimize training speed

## Need to research

- Đánh giá độ chính xác của thuật toán : Confusion matrix

- Phân lớp dữ liệu

## Need to read

- `https://ongxuanhong.wordpress.com/2015/08/25/ap-dung-cac-phuong-phap-phan-lop-classification-tren-tap-du-lieu-mushroom/`


## Need to question

- Cách trình bày khi báo cáo khoá luận (terminal)


# Technical

## Collaborate filtering

-

## Content based

- Pre-process data: trim html tag, remove stop words and stemming porter.

- TF-IDF: `https://lizrush.gitbooks.io/algorithms-for-webdevs-ebook/content/chapters/tf-idf.html`

- Cosine similarity: `https://en.wikipedia.org/wiki/Cosine_similarity`


# Library

 - natural: `https://www.npmjs.com/package/natural`


## Content Based

- `https://www.npmjs.com/package/content-based-recommender`

- `https://medium.com/@bindhubalu/content-based-recommender-system-4db1b3de03e7`

- `https://dev.to/jimatjibba/build-a-content-based-recommendation-engine-in-js-2lpi`

## Collaborative filtering

- `https://www.npmjs.com/package/recommender`

# Resource

- `https://developers.google.com/machine-learning/recommendation/content-based/basics`

- Collaborative filtering: `https://en.wikipedia.org/wiki/Collaborative_filtering`

- Stop words: `http://xpo6.com/list-of-english-stop-words/`

- Stem Porter Algorithm: `https://tartarus.org/martin/PorterStemmer/`

- TF-IDF(Term Frequency and Inverse Document Frequency): `https://en.wikipedia.org/wiki/Tf%E2%80%93idf`


- Javascript Porter Stemmer Online: `http://9ol.es/porter_js_demo.html`
