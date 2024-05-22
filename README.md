# 📊 Survey101

<p align="center">
  <img width="300" alt="logo" src="https://github.com/seohag/survey101-client/assets/126459089/33ea8aa8-3e7b-43aa-a772-94f81d000e01">
</p>

<p align="center">
  설문 양식을 직접 커스터마이징 하여 링크를 통해 공유하며 관리하고, 응답 받은 설문 결과 시각화를 도와주는 웹서비스 입니다.
</p>

<br>
<br>

# 🔗 링크

[FrontEnd Repo](https://github.com/seohag/survey101-client/tree/develop) | [Deployed web](https://web.survey101.site/) | [Notion Link](https://yummy-saw-ada.notion.site/Survey-101-1c8b8c8b46f94e7fb771455032a82a6f?pvs=4)

<br>
<br>

# 📖 목차

- [개발 동기](#-개발-동기)
- [기능 미리보기 및 간단한 설명](#-기능-미리보기-및-설명)
- [테크 스택](#-테크-스택)
  - [React Query / Zustand](#react-query-그리고-zustand는-왜-사용했을까)
  - [FormData](#왜-html-form이-아닌-formdata를-사용해서-작업했을까)
- [기술적 챌린지](#-기술적-챌린지)
  - [컴포넌트 모듈화](#컴포넌트-모듈화)
    - [가독성이 좋지 않은 코드와 동일한 코드 반복 작성](#가독성이-좋지-않은-코드와-동일한-코드-반복-작성)
    - [합성 컴포넌트 패턴으로 컴포넌트 분리](#합성-컴포넌트-패턴으로-컴포넌트-분리)
    - [결과](#결과)
  - [설문 데이터의 구조 설계](#설문-데이터-구조-설계)
    - [프로젝트에 적합한 데이터 구조는 무엇일까?](#프로젝트에-적합한-데이터-구조는-무엇일까)
    - [MongoDB의 Embedding 방식과 Reference 방식 조사](#mongodb의-embedding-방식과-reference-방식-조사)
    - [결과](#결과-1)
  - [AWS S3 이미지 업로드 에러가 발생했을 때의 에러핸들링](#aws-s3-bucket으로-이미지가-업로드-되는-과정에서의-에러-핸들링)
    - [어떠한 에러인지 클라이언트에서 알지 못했다](#어떠한-에러인지-클라이언트에서-알지-못했다)
    - [정확한 에러 전달과 해당 에러에 맞는 분기 처리](#정확한-에러-전달과-해당-에러에-맞는-분기-처리)
    - [결과](#결과-2)
  - [클라이언트와 서버와의 API 통신간 예상치 못한 에러핸들링](#클라이언트와-서버와의-api-통신간-예상치-못한-에러-핸들링)
    - [문제]()
    - [해결과정]()
    - [결과]()
  - [유저 경험과 인터페이스는 어떤 부분을 신경썼을까?](#유저-경험과-인터페이스는-어떤-부분을-신경썼을까)
- [일정](#-일정)
- [회고록](#-회고록)

<br>
<br>

# 👀 개발 동기

설문조사 양식을 만드는데 있어서 어떻게 하면 **사용자가 설문 양식을 보기좋게 입맛대로 커스터마이징 할 수 있을까?** 라는 고민으로 시작해, **응답 받는 데이터 까지도 시각화** 할 수 있다면 괜찮은 설문조사 웹 서비스가 되지 않을까 라는 답변을 내며 "Survey101" 프로젝트를 진행 해보았습니다.

사용자들이 보다 직관적이고 맞춤형 설문조사를 만들 수 있도록 도와주는 것에 초점을 맞추었으며, 간단하고 쉽게 설문 양식을 디자인 할수 있는 기능을 제공하고, 다양한 목적에 맞춘 설문을 작성할 수 있도록 서비스를 제공하고 싶었습니다. 또한 수집한 데이터를 시각화하여 제공함으로써 응답 결과를 더욱 쉽게 이해하고 분석할 수 있도록 도와주며, 이를 통해 데이터 분석에 소요되는 시간과 노력을 절약하면서 보다 의미 있는 인사이트를 얻을 수 있으면 했습니다. 이와 같은 기능들을 통해, 설문조사에 대한 접근성과 유연성을 높여 사용자들이 보다 효율적으로 정보를 수집하고 활용할 수 있도록 지원하는 것을 목표로 하는 웹서비스 입니다.

<br>
<br>

# 🖥 기능 미리보기 및 설명

**설문 생성페이지**: 사용자는 설문 커버, 스타일, 내용(질문), 마무리 섹션별로 설문 양식을 커스터마이징해서 생성할 수 있습니다.

<img width="600" alt="스크린샷 2024-05-17 05 12 52" src="https://github.com/seohag/survey101-client/assets/126459089/55bd21ac-1e59-464a-a095-0ac89fc84c4e">

- 커버 섹션은 설문 양식의 인트로를 커스터마이징 할 수 있습니다.

<br>

<img width="600" alt="스크린샷 2024-05-17 05 14 02" src="https://github.com/seohag/survey101-client/assets/126459089/8298b5cc-a913-41c5-8b45-95b16d80775c">

- 스타일 섹션은 설문 양식의 색상, 버튼 모양, 애니메이션을 커스터마이징 할 수 있습니다.

</br>

<img width="600" alt="스크린샷 2024-05-17 05 20 44" src="https://github.com/seohag/survey101-client/assets/126459089/03a6c6b7-d726-4391-8d1b-03ad2d8b33bf">

- 내용 섹션은 설문의 질문을 커스터마이징 할 수 있습니다. 질문 타입에 따라 질문들을 생성 할 수 있습니다.

</br>

<img width="600" alt="스크린샷 2024-05-17 05 21 57" src="https://github.com/seohag/survey101-client/assets/126459089/250a4006-ec5e-4ae1-8ba7-a6169c3618e4">

- 마무리 섹션은 설문 양식의 아웃트로를 텍스트 에디터를 통해 커스터마이징 할 수 있습니다.

</br>

**설문 수정 및 삭제**

<img width="600" alt="스크린샷 2024-05-17 05 26 04" src="https://github.com/seohag/survey101-client/assets/126459089/3979b36b-def2-459f-86cf-014c738bed10">

- 관리자 대쉬보드 페이지에선 생성된 설문들을 수정하고, 삭제할 수 있는 기능이 있습니다.

<br>

**링크를 통한 공유**

<img width="600" alt="스크린샷 2024-05-17 05 27 59" src="https://github.com/seohag/survey101-client/assets/126459089/3cdce143-07d4-4cac-b26a-93eb538c5685">

- 생성된 설문 양식은 링크를 통해 설문 대상자들에게 공유 가능합니다.

<br>

**공유된 설문에 대한 답변페이지**

<img width="600" alt="스크린샷 2024-05-17 05 29 39" src="https://github.com/seohag/survey101-client/assets/126459089/4f8bad88-9ea5-4343-84be-9a5bb974b767">

- 링크를 통해 공유된 설문은 설문 대상자들이 응답할 수 있습니다.

<br>

**응답결과 시각화 페이지**

<img width="600" alt="스크린샷 2024-05-17 05 31 16" src="https://github.com/seohag/survey101-client/assets/126459089/c5ea246e-9a06-48f1-8de0-9dc8f62a6fc8">

- 설문 대상자들에게 답변을 받으면 응답받은 결과들을 테이블이나 차트형식으로 시각화를 도와줍니다.

<br>
<br>

# 🔨 테크 스택

![](https://img.shields.io/badge/Javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)
![](https://img.shields.io/badge/React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![](https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=react%20query&logoColor=white)
![](https://img.shields.io/badge/Zustand-black?style=flat-square&logo=React&logoColor=black)
![](https://img.shields.io/badge/Tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)

![](https://img.shields.io/badge/Node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white)
![](https://img.shields.io/badge/Express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB)

![](https://img.shields.io/badge/Netlify-%23000000.svg?style=flat-square&logo=netlify&logoColor=#00C7B7)
![](https://img.shields.io/badge/AWS%20EB-%23FF9900.svg?style=flat-square&logo=amazon-aws&logoColor=white)
![](https://img.shields.io/badge/AWS%20S3-%23FF9900.svg?style=flat-square&logo=amazon-aws&logoColor=white)

![](https://img.shields.io/badge/React%20Dom%20Testing-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![](https://img.shields.io/badge/Vitest-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)
![](https://img.shields.io/badge/-jest-%23C21325?style=flat-square&logo=jest&logoColor=white)

<br>

### React Query 그리고 Zustand는 왜 사용했을까?

설문을 커스터마이징 하고, 커스터마이징한 설문을 데이터베이스에 저장하고 불러오는 등의 작업들을 하다보면 클라이언트와 서버와의 상호작용이 잦았습니다. 설문 양식을 생성, 수정, 삭제 하는 등 CRUD 작업이 많은 프로젝트였기에 클라이언트에 저장되는 데이터들은 변화되기 쉬운 성격을 가지고 있었습니다. 서버와 클라이언트 간의 데이터가 같은 데이터임에도 시점 차이로 인한 클라이언트와 서버와의 데이터가 달라질 수 있는 상황이 있을 수 있기에 데이터의 정확성과 일관성 유지를 위해 클라이언트와 서버의 상태를 분리해서 관리했고, `React Query`의 상태관리의 이점들을 활용하고자 선택하였습니다.

`React Query` 는 캐싱 기능 또한 제공 해주는데, 서버에서 가져온 데이터를 queryClient에 담아 클라이언트에서 서버 측으로 다른 요청이 없는 한 다시 서버로 재요청하지 않고, 캐싱되어있던 데이터를 다시 반환해주기 때문에 불필요한 요청을 최소화할 수 있는 장점도 있었습니다. fresh / stale 을 기준으로 데이터의 상태가 최초에 서버로부터 전달받아 캐싱되어 있던 상태라는 가정하에 만료되었다면 재요청하고, 만료되지 않았다면 캐싱된 데이터를 반환하는 메커니즘을 가지고 있습니다. 따라서 캐싱이 필요한 컴포넌트마다 `React Query` 의 queryClient와 만료시간을 활용해서 재요청을 최소화 하는 용도로 사용하였습니다.

**Survey101** 에서는 다양한 형태의 질문, 각 질문에 대한 옵션, 응답 데이터 등을 관리해야 했고, 이런 복잡한 상태를 효율적으로 관리할 상태관리 툴이 필요했습니다.

`Zustand` 는 중앙집중화된 하나의 store 안에 여러 상태들을 담고, Top-down 방식으로 Flux 원칙을 적용한 상태관리를 적용하며 간단한 상태 관리 방법을 제공해줍니다. 사용자가 설문에 대한 질문을 추가하거나 수정할 때 다른 부분의 상태와 충돌 없이 일관된 상태를 유지해야 하는 이유도 있었고, 설문조사를 커스터마이징 하는 화면에서 여러 컴포넌트가 동일한 상태를 공유하고 업데이트 해야했기에, `Zustand`를 사용해서 전역상태로 공유하였습니다. 또한 스토어의 상태 변경이 일어날 때 리스너 함수를 모았다가 상태가 변경되면 그때 리스너들에게 상태가 변경되었다고 알려줍니다. 상태의 변경,조회,구독 등을 통해서만 스토어를 다루고, 실제 상태는 컴포넌트 생명주기 내에 의도지 않게 변경되는 것을 막아줍니다.

또한 selector 함수로 가져온 상태는 store에 중앙집권화 되어있는 상태와 독립적으로 관리되기 때문에 컴포넌트가 필요한 상태에 집중할 수 있고, 상태의 변경에 따라 필요한 부분만 업데이트 되는 이유와, 별도의 리듀서, 액션, 미들웨어 없이 상태관리가 가능하고, 컴포넌트 간의 상태 공유를 용이하게 해주는 장점이 있다고 조사했습니다.

```jsx
import { create } from "zustand";

import { v4 as uuidv4 } from "uuid";

const useFormEditorStore = create((set) => ({
  activeSection: "cover",
  coverData: {
    title: "설문지",
    subtitle: "",
    startButtonText: "설문 시작하기",
    coverImage: null,
  },
  styleData: {
    themeColor: "#000000",
    buttonShape: "rounded",
    animation: "fade",
  },
  endingData: {
    title: "설문 완료",
    content: "결과에 대한 내용을 입력해주세요.",
  },
  questions: [
    {
      questionId: uuidv4(),
      questionType: "imageChoice",
      questionText: "",
      options: [{ optionId: uuidv4(), image: null }],
    },
  ],

  setActiveSection: (section) => set({ activeSection: section }),
  setCoverData: (data) => set({ coverData: { ...data } }),
  setStyleData: (data) => set({ styleData: { ...data } }),
  setEndingData: (data) => set({ endingData: { ...data } }),
  setQuestions: (data) => set({ questions: data }),
}));

export default useFormEditorStore;
```

이러한 이유들로 인해 `React Query`로는 서버 데이터 페칭 및 캐싱을 담당하게 했고, `Zustand`로는 클라이언트 상태 관리 및 UI 업데이트를 담당하며 명확한 책임 분리를 하여 상태관리를 하였습니다.

<br>

### 왜 HTML Form이 아닌 FormData를 사용해서 작업했을까?

첫번째 이유는 사용자 경험적인 측면이였습니다. 기존에 HTML의 form으로 작업을 했을 땐 폼이 제출될 때 페이지가 리로드 되는 현상이 있었습니다. 그러나 FormData는 페이지 리로드 없이 서버로 데이터를 전송할 수 있었기 때문에 해당 방식으로 작업을 하였습니다.

두번째 이유는 저의 프로젝트의 데이터 구조상 FormData가 적합했습니다. 서버에 전송하는 데이터 구조가 사진과 같았기에 (중첩된 구조), 파일 객체들과 옵션 ID를 자바스크립트로 조작할 수 있는 FormData를 선택 후 사용하였습니다.

<p align="center">
<img width="350" height="260" alt="스크린샷 2024-05-17 06 03 57" src="https://github.com/seohag/survey101-client/assets/126459089/175d3efc-ea4b-4f1f-9ed6-999273468e35">
<img width="350" alt="스크린샷 2024-05-17 06 04 27" src="https://github.com/seohag/survey101-client/assets/126459089/0d4ef465-50c4-44b0-940f-d2aa38e18115">
</p>

<br>

| **특성**             | **HTML Form**                                             | **FormData**                                  |
| -------------------- | --------------------------------------------------------- | --------------------------------------------- |
| **구현 방식**        | `<form>` 태그와 HTML 요소들로 구현                        | 자바스크립트의 `FormData` 객체로 구현         |
| **데이터 전송 방법** | 폼 제출 시 브라우저가 자동으로 전송                       | Axios 또는 Fetch API를 사용한 비동기 전송     |
| **페이지 리로드**    | 기본적으로 페이지 리로드가 발생                           | 페이지 리로드 없이 비동기 전송 가능           |
| **동적 데이터 추가** | 폼 제출 전 데이터 조작이 어려움                           | 자바스크립트를 통해 동적으로 데이터 추가 가능 |
| **파일 업로드 지원** | 지원 (enctype="multipart/form-data")                      | 지원                                          |
| **데이터 포맷**      | 기본적으로 URL 인코딩 (application/x-www-form-urlencoded) | 멀티파트 폼 데이터 (multipart/form-data)      |
| **사용 편의성**      | HTML만으로 쉽게 구현 가능                                 | 자바스크립트 코딩이 필요                      |
| **유연성**           | 폼 요소 추가/수정에 제한적                                | 동적 폼 요소 추가/수정에 유연함               |

<br>
<br>

# 🏔 기술적 챌린지

## 컴포넌트 모듈화

### 가독성이 좋지 않은 코드와 동일한 코드 반복 작성:

프로젝트를 진행하던 중, 설문 미리보기, 그리고 답변 페이지가 비슷한 UI를 사용함에도 불구하고 동일한 코드를 반복해서 조건부 렌더링으로 처리하고 있었습니다. 이러한 처리 방식은 코드 중복 작성을 초래했고, 유지 보수성을 떨어뜨리며 가독성을 저하시키는 문제점이 있었습니다.

### 합성 컴포넌트 패턴으로 컴포넌트 분리:

컴포넌트 분리에 대해 여러 정보들을 찾아보던 중 합성 컴포넌트 패턴이 문제를 해결하기에 적합하다는 판단 하에 프로젝트에 적용해보았습니다.

우선 아래 예시 코드를 보았을 때, `QuestionPreview` 라는 컴포넌트 내에서 (textChoice, imageChoice 등)을 조건부 렌더링으로 처리하면서 코드가 복잡해지고, 특정 질문 타입을 수정할 때마다 `QuestionPreview` 컴포넌트의 모든 코드를 읽으며 특정 질문 타입을 찾아서 직접적으로 수정해야만 했습니다.

<br>

```jsx
import CustomButton from "../CustomButton";

function QuestionPreview({ questions, styleData, selectedQuestionId }) {
  const selectedQuestion = questions.find(
    (question) => question.questionId === selectedQuestionId,
  );

  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-4 flex justify-center items-center min-h-[642px]">
      <div className="text-center">
        {selectedQuestion && (
          <div className="p-4 border border-gray-300 rounded min-h-[572px] min-w-[350.594px]">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: styleData.themeColor }}
            >
              {selectedQuestion.questionText}
            </h3>
            {selectedQuestion.questionType === "textChoice" && (
              <div className="mt-4 flex flex-col items-center">
                {selectedQuestion.options.map((option) => (
                  <CustomButton
                    key={option.optionId}
                    text={option.text}
                    themeColor={styleData.themeColor}
                    buttonShape={styleData.buttonShape}
                  />
                ))}
              </div>
            )}
            {selectedQuestion.questionType === "imageChoice" && (
              <div className="flex flex-wrap justify-center mt-4">
                {selectedQuestion.options.map((option) => (
                  <button key={option.optionId} className="mb-4 mx-2">
                    {option.image && (
                      <img
                        src={
                          typeof option.image.imageUrl === "string"
                            ? option.image.imageUrl
                            : URL.createObjectURL(option.image)
                        }
                        alt={`${option.optionId}`}
                        className="w-24 h-24 object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default QuestionPreview;
```

- 기존에 동일한 코드를 반복해서 조건부 렌더링으로 처리해서 가독성이 떨어지던 코드 (as-is)

<br>

```jsx
import TextChoiceQuestion from "./TextChoiceQuestion";
import ImageChoiceQuestion from "./ImageChoiceQuestion";
import TextInputQuestion from "./TextInputQuestion";
...

function QuestionPreview({ questions, styleData, selectedQuestionId }) {
  const selectedQuestion = questions.find(
    (question) => question.questionId === selectedQuestionId,
  );

  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-4 flex justify-center items-center min-h-[642px]">
      <div className="text-center">
        {selectedQuestion && (
          <div className="p-4 border border-gray-300 rounded min-h-[572px] min-w-[350.594px]">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: styleData.themeColor }}
            >
              {selectedQuestion.questionText}
            </h3>
            {selectedQuestion.questionType === "textChoice" && (
              <TextChoiceQuestion
                styleData={styleData}
                options={selectedQuestion.options}
              />
            )}
            {selectedQuestion.questionType === "imageChoice" && (
              <ImageChoiceQuestion
                options={selectedQuestion.options}
                styleData={styleData}
              />
            )}
            {selectedQuestion.questionType === "textInput" && (
              <TextInputQuestion styleData={styleData} />
            )}
            ...
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionPreview;
```

- 합성 컴포넌트 패턴을 적용시켜 관심사를 분리한 코드 (to-be)

### 결과:

합성 컴포넌트 패턴을 이용하여 분리한 코드에서는 각 질문 타입에 해당되는 컴포넌트에 역할을 위임하며 이를 통해 질문 타입들마다 컴포넌트를 독립적으로 관리할 수 있고, 기존코드에 비해 가독성을 향상 시켰습니다. 또한 질문 미리보기와 비슷한 설문에 대한 답변을 하는 컴포넌트에서도 동일한 패턴을 이용해서 재사용성과 유연성을 향상 시킬 수 있었습니다. 기존의 코드에선 하나의 컴포넌트에서 많은 책임을 지고 있었기에 유지보수 할 때 모든 코드를 살펴봐야 했지만, 컴포넌트를 분리함으로써 단일 책임 원칙을 지킬 수 있게끔 하였습니다.

<br>

## 설문 데이터 구조 설계

### 프로젝트에 적합한 데이터 구조는 무엇일까?:

데이터 구조를 설계하는 방법을 잘 알지 못했기에 설문에 대한 데이터 스키마 모델링을 하기 위해선 어떤 데이터 구조로 설계하는 것이 가장 효율적이고, 적절한 방식인지에 대한 고민으로 시작했습니다.

### MongoDB의 Embedding 방식과 Reference 방식 조사:

Survey101는 설문조사를 커스터마이징 하고, 관리하는 특성을 가지고 있는 프로젝트입니다. 즉 한명의 유저가 여러개의 설문 양식을 만들고, 만들어 놓은 여러 설문들을 관리할 수 있는 기능을 가지고 있기에 한명의 유저가 많은 설문을 생성하는 1 대 다 관계로 설정하는 방식을 선택했습니다. 또한 MongoDB의 데이터 구조 모델을 찾아보는 중 **embedding** 방식과 **reference** 방식을 찾게되었고, 두 방식은 아래와 같은 장단점과 특징을 가지고 있다는 것을 조사했습니다.

**embedding** 방식은 하나의 요청으로 하나의 문서에 관련된 데이터에 모두 접근할 수 있으며, embedding 모델을 사용하면 애플리케이션이 동일한 데이터베이스 관련 정보를 쿼리할 수 있고, 필요한 쿼리 및 업데이트 횟수를 줄일 수 있다는 장점을 가지고 있었습니다. 그러나 너무 많이 중첩되는 형태가 될 수 있고, 용량 크기 제한이 있습니다.

**reference** 방식은 데이터 간의 관게를 저장하며, 데이터가 여러 컬렉션으로 나뉘고 중첩되지 않기 때문에 데이터가 정규화 되어 있고 유연합니다. 대신 한번의 쿼리로 모든 데이터를 읽어오지 못하기 때문에 읽는 속도는 embedding 방식보단 느리고, 연결된 데이터가 바뀔 때 일관성 유지가 어렵습니다.

<br>

| 특성              | Reference 방식                             | Embedding 방식                                |
| ----------------- | ------------------------------------------ | --------------------------------------------- |
| **데이터 구조**   | 관련 데이터를 별도의 도큐먼트로 저장       | 관련 데이터를 하나의 도큐먼트에 중첩시켜 저장 |
| **데이터 일관성** | 여러 도큐먼트에 분산되어 있어 관리가 복잡  | 단일 도큐먼트 내에 있어 관리가 용이           |
| **쿼리 복잡도**   | 조인을 사용한 복잡한 쿼리가 필요할 수 있음 | 단일 도큐먼트 조회로 간단한 쿼리 가능         |
| **성능**          | 읽기 성능이 다소 낮을 수 있음              | 읽기 성능이 우수                              |
| **쓰기 성능**     | 쓰기 성능이 우수                           | 쓰기 성능이 다소 낮을 수 있음                 |
| **데이터 중복**   | 데이터 중복이 없음                         | 데이터 중복 가능                              |
| **변경 빈도**     | 자주 변경되는 데이터에 적합                | 자주 변경되지 않는 데이터에 적합              |
| **데이터 크기**   | 큰 데이터를 효과적으로 처리 가능           | 도큐먼트 크기가 제한을 초과할 수 있음         |
| **관계 유형**     | 복잡한 다대다 관계를 표현하는 데 적합      | 단순한 일대다 관계를 표현하는 데 적합         |

### 결과:

결과적으로 이러한 차이점을 가지고 있는 부분을 학습해서 Survey101의 설문 데이터는 데이터가 매우 크거나 복잡해서 하나의 도큐먼트에 담기 어렵지 않고, 여러 설문조사에 걸쳐 동일한 질문이나 옵션을 재사용하는 경우가 없다는 등의 특성을 고려해서 Embedding 방식을 사용한 데이터 구조를 적용시켰습니다.

<br>

<img width="700" alt="스크린샷 2024-05-17 07 24 01" src="https://github.com/seohag/survey101-client/assets/126459089/5f1a9d3a-e6f4-4793-bccd-d44d1d859466">

<br>

## AWS S3 bucket을 이용한 서버에서 이미지를 업로드 과정에서의 에러핸들링

AWS S3 bucket을 선택한 이유:
POC 단계에서 이미지파일을 어떠한 방식으로 다룰 수 있을까 고민을 했었습니다. 기존에 MongoDB를 사용해본 기억이 있어 MongoDB를 사용한 이미지 파일 방법들을 조사해보았습니다. Binary JSON 데이터로 변환하여(Base64 인코딩) 데이터베이스 도큐먼트 내에 직접 저장하는 방식이 있었고, 외부 파일 스토리지와 연동하여 저장하는 방법이 있었습니다.

BSON 데이터로 변환하여 이미지 파일을 MongoDB 도큐먼트 내에 직접 저장하는 방식으로 하려니 16MB로 문서 크기 제한이 있었고, 대용량 바이너리 데이터를 처리하기엔 한계가 있었습니다. 또한 Base64로 인코딩하게 되면 원래 크기보다 커지는 단점이 있어서, 저장 공간이 빠르게 소진되는 단점이 있었습니다.

AWS S3는 CDN(Content Delivery Network)과 통합하여 안정적인 이미지 전달이 가능하고, 대규모 이미지 파일을(최대 5TB) 효율적으로 저장하며, 고가용성 및 내구성, 확장성이 뛰어난 장점을 갖고 있습니다. 또한 imageUrl과 key값등을 제공해주기 데이터베이스에 url, key 값들만 저장해 클라이언트에서 사용하기 편한 장점이 있었습니다. 이러한 이유들로 인해 AWS S3 bucket에 이미지 파일들을 업로드 하는 방법을 택했습니다.

### 어떠한 에러인지 클라이언트에서 알지 못했다:

서버 측에서 AWS S3에 업로드 할때 이미지 파일이 업로드 되는 중에 에러가 발생했음에도, 클라이언트 측에선 업로드가 된듯한 UI인 설문 공유 링크 모달창이 뜨는 문제점이 있었습니다.

### 정확한 에러 전달과 해당 에러에 맞는 분기 처리:

```js
async function uploadImageToS3(file, optionId) {
  const s3Client = getS3Client();
  const imageId = optionId || uuidv4();
  const bucketName = process.env.AWS_BUCKET_NAME;
  const putObjectCommand = getPutObjectCommand(
    bucketName,
    imageId,
    file.buffer,
  );

  try {
    await s3Client.send(putObjectCommand);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageId}`;

    return { imageId, imageUrl };
  } catch (error) {
    res.status(500).json({ message: "이미지 업로드 실패" });
    console.error("S3에 업로드 하는데 실패:", error);
  }
}
```

이러한 방식으로 AWS S3가 업로드 되는 도중에 에러가 발생하면 상태코드와 함께 "이미지 업로드 실패" 라는 메시지를 클라이언트 측으로 정확한 에러전달을 해주었습니다.

```js
const { mutateAsync: fetchSurvey } = useMutation({
  mutationFn: handleFetchSurvey,
  useErrorBoundary: true,
  onSuccess: (data) => {
    setSurveyUrl(data);
    navigate("dash");
  },
  onError: (error) => {
    if (error.response.message === "이미지 업로드 실패") {
      setErrormessage(
        "이미지를 업로드 하는 동안 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }
  },
});
```

클라이언트 측에서는 이러한 api 요청을 보냈을 때 response의 결과에 따라 명확한 에러핸들링을 해주는 방식으로 코드를 작성해보았습니다.

### 결과:

이러한 에러핸들링을 해줌으로써 이미지 업로드를 하는 비동기 작업간에 에러가 난다면 bucket에 업로드 하는 과정에서 에러가 났는지, 서버 측의 다른 부분에서 에러가 났는지 확실히 알 수 없기 때문에 클라이언트로 유의미한 에러를 전달하였고, 정확한 에러핸들링을 할 수 있게끔 하였습니다. 이로 인해 에러조차 알 수 없는 상황을 방지하여 개발자 경험과 유저 경험을 향상 시켰습니다.

## 클라이언트와 서버와의 API 통신간 예상치 못한 에러 핸들링

### 문제:

클라이언트와 서버와의 API 통신간 예상치 못한 에러 핸들링

### 해결과정:

- ...

### 결과:

### 유저 경험과 인터페이스는 어떤 부분을 신경썼을까?

- ...

<br>
<br>

###

# 🗓 일정

- 1주차

  - 아이디어 수집 및 선정

  - Kanban 작성

- 2주차

  - 클라이언트, 서버 초기 세팅 (보일러 플레이트)

  - 초기 페이지, 대쉬보드 페이지 구현

  - 설문 편집 페이지 각 섹션별 기능 구현

  - 설문에 대한 답변 시각화 페이지 구현

  - 서버 측과 클라이언트 측 API 연동

- 3주차

  - 전체적인 리팩토링 / 버그 수정

  - 리드미 작성

  - 배포

<br>
<br>

# 📝 회고록
