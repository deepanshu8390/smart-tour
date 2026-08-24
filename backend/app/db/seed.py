from app.repositories.location_repository import location_repository


def seed_data() -> None:
    if location_repository.count() > 0:
        return

    location_repository.seed(
        [
            {
                "projectId": 101,
                "type": "Beach",
                "name": "Goa",
                "shortDescription": "Beaches, nightlife, and easy coastal escapes.",
                "description": "Goa blends relaxed beaches, water sports, old forts, and a laid-back travel vibe.",
                "rating": 4.8,
                "reviewCount": 124,
                "location": "India",
                "hero": {
                    "title": "Experience Goa",
                    "description": "Explore beaches, nightlife, and coastal culture.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Goa?",
                "whyChooseDescription": "It is ideal for short breaks, group travel, and beach-focused itineraries.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Goa beach"},
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Goa sunset"},
                ],
                "faqs": [
                    {"question": "Is Goa family friendly?", "answer": "Yes, especially for relaxed beach stays and easy sightseeing."},
                    {"question": "What is included?", "answer": "The location page can describe the itinerary, stays, and highlights."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
            {
                "projectId": 102,
                "type": "Mountains",
                "name": "Manali",
                "shortDescription": "Snow views, adventure sports, and mountain air.",
                "description": "Manali is known for alpine scenery, winter travel, and outdoor adventure activities.",
                "rating": 4.7,
                "reviewCount": 98,
                "location": "India",
                "hero": {
                    "title": "Visit Manali",
                    "description": "A mountain destination for relaxation and adventure.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Manali?",
                "whyChooseDescription": "A strong option for scenic trips and adventure-oriented visitors.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Manali mountains"},
                ],
                "faqs": [
                    {"question": "Best season?", "answer": "Depends on whether you want snow or clear mountain weather."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
            {
                "projectId": 103,
                "type": "City",
                "name": "Jaipur",
                "shortDescription": "Heritage, food, and structured city touring.",
                "description": "Jaipur offers palaces, forts, bazaars, and a compact city travel experience.",
                "rating": 4.6,
                "reviewCount": 156,
                "location": "India",
                "hero": {
                    "title": "Discover Jaipur",
                    "description": "A city destination rooted in heritage and culture.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Jaipur?",
                "whyChooseDescription": "A good fit for culture-first travel with easy sightseeing loops.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Jaipur palace"},
                ],
                "faqs": [
                    {"question": "Is it good for short trips?", "answer": "Yes, the city is easy to cover in a few days."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
            {
                "projectId": 104,
                "type": "Adventure",
                "name": "Rishikesh",
                "shortDescription": "River adventures, rafting, and wellness stays.",
                "description": "Rishikesh is a compact destination for adventure and spiritual travel.",
                "rating": 4.9,
                "reviewCount": 211,
                "location": "India",
                "hero": {
                    "title": "Go to Rishikesh",
                    "description": "Adventure by the river with a calm travel pace.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Rishikesh?",
                "whyChooseDescription": "It works well for short adventure trips and wellness-focused travel.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Rishikesh river"},
                ],
                "faqs": [
                    {"question": "Is rafting included?", "answer": "The location detail can describe available activities and packages."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
            {
                "projectId": 105,
                "type": "Beach",
                "name": "Andaman",
                "shortDescription": "Clear water, islands, and slower travel days.",
                "description": "Andaman is suited to travelers who want island scenery and calm beach time.",
                "rating": 4.9,
                "reviewCount": 87,
                "location": "India",
                "hero": {
                    "title": "Explore Andaman",
                    "description": "A quieter beach destination with island character.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Andaman?",
                "whyChooseDescription": "A clean choice for scenic and relaxed coastal itineraries.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Andaman islands"},
                ],
                "faqs": [
                    {"question": "How do I get there?", "answer": "The location detail page can explain travel access and booking flow."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
            {
                "projectId": 106,
                "type": "Mountains",
                "name": "Kashmir",
                "shortDescription": "Lakes, valleys, and scenic seasonal travel.",
                "description": "Kashmir is a high-interest mountain destination with strong visual appeal.",
                "rating": 4.8,
                "reviewCount": 143,
                "location": "India",
                "hero": {
                    "title": "Travel to Kashmir",
                    "description": "Scenic landscapes and seasonal mountain travel.",
                    "image": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
                },
                "whyChooseTitle": "Why Choose Kashmir?",
                "whyChooseDescription": "Great for travelers seeking landscape-driven trips.",
                "images": [
                    {"url": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg", "alt": "Kashmir valley"},
                ],
                "faqs": [
                    {"question": "What makes it special?", "answer": "Scenery, seasonal variety, and a strong destination identity."},
                ],
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,f_auto,q_auto/sample.jpg",
            },
        ]
    )
