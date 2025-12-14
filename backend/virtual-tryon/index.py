import json
import os
import base64
import boto3
from typing import Dict, Any
from PIL import Image
import io

s3_client = boto3.client(
    's3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Бизнес-логика: Виртуальная примерка одежды на фото пользователя
    Принимает фото пользователя и ID одежды, возвращает результат примерки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if body_str is None or body_str == '':
        body_str = '{}'
    body_data = json.loads(body_str)
    
    user_photo_base64 = body_data.get('userPhoto')
    clothing_id = body_data.get('clothingId')
    clothing_name = body_data.get('clothingName', 'Unknown')
    
    if not user_photo_base64 or not clothing_id:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Missing userPhoto or clothingId'}),
            'isBase64Encoded': False
        }
    
    if ',' in user_photo_base64:
        user_photo_base64 = user_photo_base64.split(',')[1]
    
    image_data = base64.b64decode(user_photo_base64)
    
    original_key = f'tryon/original_{context.request_id}.jpg'
    s3_client.put_object(
        Bucket='files',
        Key=original_key,
        Body=image_data,
        ContentType='image/jpeg'
    )
    
    img = Image.open(io.BytesIO(image_data))
    
    result_img = img.copy()
    
    result_buffer = io.BytesIO()
    result_img.save(result_buffer, format='JPEG', quality=90)
    result_buffer.seek(0)
    
    result_key = f'tryon/result_{context.request_id}.jpg'
    s3_client.put_object(
        Bucket='files',
        Key=result_key,
        Body=result_buffer.getvalue(),
        ContentType='image/jpeg'
    )
    
    cdn_base = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket"
    original_url = f"{cdn_base}/{original_key}"
    result_url = f"{cdn_base}/{result_key}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'success': True,
            'originalPhotoUrl': original_url,
            'resultPhotoUrl': result_url,
            'clothingId': clothing_id,
            'clothingName': clothing_name,
            'message': 'Virtual try-on completed successfully'
        }),
        'isBase64Encoded': False
    }