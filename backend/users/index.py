import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Бизнес-логика: Управление пользователями
    POST - создать/получить пользователя, GET - получить информацию о пользователе
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if body_str is None or body_str == '':
            body_str = '{}'
        body_data = json.loads(body_str)
        email = body_data.get('email')
        name = body_data.get('name', '')
        
        if not email:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Email is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            SELECT id, email, name, created_at 
            FROM t_p3162120_dress_by_photo.users 
            WHERE email = %s
        ''', (email,))
        
        user = cursor.fetchone()
        
        if user:
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'userId': user[0],
                    'email': user[1],
                    'name': user[2],
                    'createdAt': user[3].isoformat() if user[3] else None
                }),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            INSERT INTO t_p3162120_dress_by_photo.users (email, name)
            VALUES (%s, %s)
            RETURNING id, created_at
        ''', (email, name))
        
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
                'userId': result[0],
                'email': email,
                'name': name,
                'createdAt': result[1].isoformat() if result[1] else None
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('userId')
        
        if not user_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'userId parameter required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            SELECT id, email, name, created_at 
            FROM t_p3162120_dress_by_photo.users 
            WHERE id = %s
        ''', (user_id,))
        
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'userId': user[0],
                'email': user[1],
                'name': user[2],
                'createdAt': user[3].isoformat() if user[3] else None
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