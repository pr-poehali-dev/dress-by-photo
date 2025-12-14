import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Бизнес-логика: Управление сохранёнными образами пользователя
    GET - получить список образов, POST - сохранить образ
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'User ID required in X-User-Id header'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if method == 'GET':
        cursor.execute('''
            SELECT id, original_photo_url, result_photo_url, 
                   clothing_item_id, clothing_name, created_at 
            FROM t_p3162120_dress_by_photo.outfits 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        ''', (user_id,))
        
        rows = cursor.fetchall()
        outfits = []
        for row in rows:
            outfits.append({
                'id': row[0],
                'originalPhotoUrl': row[1],
                'resultPhotoUrl': row[2],
                'clothingItemId': row[3],
                'clothingName': row[4],
                'createdAt': row[5].isoformat() if row[5] else None
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'outfits': outfits}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if body_str is None or body_str == '':
            body_str = '{}'
        body_data = json.loads(body_str)
        
        original_photo_url = body_data.get('originalPhotoUrl')
        result_photo_url = body_data.get('resultPhotoUrl')
        clothing_item_id = body_data.get('clothingItemId')
        clothing_name = body_data.get('clothingName')
        
        if not original_photo_url or not result_photo_url:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            INSERT INTO t_p3162120_dress_by_photo.outfits 
            (user_id, original_photo_url, result_photo_url, clothing_item_id, clothing_name)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, created_at
        ''', (user_id, original_photo_url, result_photo_url, clothing_item_id, clothing_name))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'outfitId': result[0],
                'createdAt': result[1].isoformat() if result[1] else None
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }