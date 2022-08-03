from detoxify import Detoxify
import sys
prediction = Detoxify('original').predict(sys.argv[1])
print(prediction)
print("ok")
