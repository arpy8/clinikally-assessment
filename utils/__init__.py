import requests
from typing import List

def fetch_products(product_ids: List[int]) -> List[dict]:
    """Fetch products from dummy API"""
    products = []
    for product_id in product_ids:
        try:
            response = requests.get(f"https://dummyjson.com/products/{product_id}")
            if response.status_code == 200:
                product = response.json()
                products.append({
                    "id": product.get("id"),
                    "title": product.get("title"),
                    "description": product.get("description"),
                    "price": product.get("price")
                })
        except:
            products.append({
                "id": product_id, 
                "title": "Product not found", 
                "description": "", 
                "price": 0
            })
    return products