# Mini_Hexagon
Shader를 이용한 게임

# 설명
- 기간:2021/05/21 ~ 2021/06/9
- 인원: 1인
- 언어: 자바스크립트와 HTML
- 설명: 리듬게임 헥사곤처럼 맵 밖에서 다가오는 장애물을 피하는 게임, 
      자바 스크립트에서 벡터와 색, 명조, 여타 다른 계산을 맡고
      HTML에서 vertex-shader와 이중 버퍼를 이용해서 부드러운 영상을 출력합니다.
     
# 이미지
<img src="https://user-images.githubusercontent.com/59460871/154225292-1b7d8099-1001-4622-9ec6-ede7e7d573b5.PNG"  width="400" height="200"/>
- 실행 시 보이게 되는 게임 화면입니다.



# HTML
<img src="https://user-images.githubusercontent.com/59460871/157811227-6728c92a-3bc3-4b94-a33b-48403a4ebd22.PNG"  width="400" height="200"/>

- HTML파일 코드입니다.
- vertex shader는 3차원 벡터를 2차원에서 어떻게 그릴지 정하며 fragment shader는 색상을 결정합니다.
- attribute는 코드(현재는 자바스크립트)의 정보를 받아옵니다
- uniform은 전역변수처럼 일괄적으로 사용됩니다
- varing은 vertex에서 fragment로 정보를 전달합니다.


# JavaScript

<img src="https://user-images.githubusercontent.com/59460871/157814889-b46e1a6b-645f-411c-91d1-0ef950e49cc9.PNG"  width="400" height="200"/>
<img src="https://user-images.githubusercontent.com/59460871/157815202-4b07dd24-7529-49bd-a9d5-a5c88c5b9a1e.PNG"  width="400" height="200"/>
- 영상을 그릴때 처음 실행되는 함수입니다.
- 키 이벤트를 넣어 움직일 수 있게 했습니다.
- 처음 실행되기에 배경과 바탕색을 넣어주고 rander를 불러 그리기를 시작합니다.


<img src="https://user-images.githubusercontent.com/59460871/157813968-5ab9d989-1f45-4fb0-8191-cc33cc01d31a.PNG"  width="400" height="200"/>
- 빠른 영상을 위해 GPU에 정보를 넘깁니다.
- 넘긴 정보가 계산되면 HTML에서 사용될 것입니다.
- 버퍼를 이용해서 영상을 보여줌과 동시에 뒤에서 다음 장면의 계산을 미리해둡니다.


<img src="https://user-images.githubusercontent.com/59460871/157815257-879e8082-56aa-483c-8cc1-3c3f474153a1.PNG"  width="400" height="200"/>
- 그리기 부분입니다. GPU계산에 사용할 버퍼를 클리어해줍니다.
- 기존의 theta 값을 약간 변경해주면 회전하는 효과가 됩니다. uniform형식이니 바로 전달해줍니다.
- 장애물 생성과 충돌체크를 확인한 뒤 GPU를 실행시켜줍니다


<img src="https://user-images.githubusercontent.com/59460871/157815988-53c86baa-b9a0-4f41-8b60-d5d0fcc8a0f3.PNG"  width="400" height="200"/>
- 마지막 충돌체크 부분입니다.
- 다른 게임엔진처럼 따로 함수가 없기에 포인트마다 겹치는지를 확인하는 형식으로 체크했습니다.
- x축과 y축을 따로 계산하여 겹치게 된다면 게임이 멈추게 됩니다.


# 느낀점
3개월 동안의 강의였습니다. 카메라 뷰와 색상, 충돌등의 내용이 기억에 남는군요. 코딩부분은 한 두달 해보니 익숙해졌지만 개념부분은 아직도 어려운 느낌이 듭니다. 

순식간에 지나가는 영상 속에 세밀한 계산을 알게되니 게임 엔진같은 프로그램의 고마움과 자체 엔진을 만든다는 것의 어려움을 알게 된것 같습니다.

다뤄야할 벡터와 포인트가 늘어나면서 이 정보를 다뤄야 할 요령의 필요성을 느꼇습니다. 개발자 분들께서 말씀하시는 알고리즘의 중요성이 들어나는 부분인것 같습니다.

다른 개발자 분들의 정돈된 코드를 보면 '와' 소리가 나오는데 계속해서 프로그램 보는 눈을 길러야겠다는 생각이 드는 경험이었습니다.




