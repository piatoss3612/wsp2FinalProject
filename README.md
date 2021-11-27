# wsp2 final project

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

---

# Issues

### 2021-11-24 ~ 2021-11-26
1. ~~이미지를 다운로드할 때 여러 개가 다운로드 되는 문제~~
   - dialog를 통해 지정된 파일명과 형식으로 다운로드 받도록 수정
2. ~~이미지를 다운로드할 때 캔버스가 resize되는 문제~~
   - 브라우저가 리사이즈됨에 따라 캔버스가 초기화되는 현상은 현재는 **해결 불가**
3. ~~웹 환경이 아닌 경우, ml5 라이브러리가 정상 동작하지 않는 문제~~
   - 테스트 결과, 웹 환경이 아닌 경우에는 사용자가 그린 선(stroke)를 인식하지 못함
   - 점(dot)은 인식할 수 있기 때문에 일단은 이대로 진행
4. ~~캔버스의 사이즈가 responsive 하지만, height가 이상하게 길어지는 문제~~
    - 임시방편으로 흰색 캔버스가 화면 하단 전체를 차지하도록 배치

### 2021-11-27
1. ~~chip group에 중복되는 요소가 들어갈 경우, 오류 발생 가능~~
   - 추가되는 chip이 이미 배열에 존재한다면 추가하지 않도록 수정
2. 모바일, 태블릿 환경에서 머신러닝의 스케치 속도가 너무 느린 문제
3. v-select에서 모델을 선택할 때 캔버스 위에서 클릭하면 캔버스에 점이 찍히는 문제