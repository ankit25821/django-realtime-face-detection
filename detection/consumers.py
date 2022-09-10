import json

from channels.generic.websocket import WebsocketConsumer

from detection.detection import detect_face
from detection.utils import base64_to_np_array, np_array_to_base64_image


class DefaultConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def receive(self, *, text_data):
        image = base64_to_np_array(text_data)
        detected_face = detect_face(image)
        imageData = np_array_to_base64_image(detected_face).decode('utf-8')
        b64_src = 'data:image/jpeg;base64,'
        stringData = b64_src + imageData
        self.send(
            json.dumps({
                'type':'IMAGE_RESPONSE',
                'image_data': stringData
            })
        )

    def disconnect(self, message):
        pass
