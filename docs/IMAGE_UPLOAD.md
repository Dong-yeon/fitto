# 이미지 전송 설정 (Cloudinary)

채팅 사진 전송은 **Cloudinary**(무료)를 씁니다. 클라이언트가 이미지를 Cloudinary에 올리고,
그 URL만 메시지로 전송합니다. **백엔드 변경은 없습니다.**

## 1. Cloudinary 무료 계정 만들기

1. https://cloudinary.com 가입 (무료)
2. 대시보드에서 **Cloud name** 확인 (예: `dxxxxxx`)

## 2. Unsigned 업로드 프리셋 만들기

1. 우측 상단 **Settings(⚙️) → Upload** 탭
2. **Upload presets → Add upload preset**
3. **Signing Mode** 를 **Unsigned** 로 변경
4. (권장) 안전하게 제한:
   - **Folder**: `fitto` 같은 폴더 지정
   - **Allowed formats**: `jpg,png,webp`
   - **Max file size**: 예: 5MB
5. 저장 후 **preset 이름** 확인 (예: `fitto_unsigned`)

## 3. 앱에 값 채우기

`frontend/src/constants/config.ts` 의 `CLOUDINARY` 를 본인 값으로 수정:

```ts
export const CLOUDINARY = {
  cloudName: 'dxxxxxx',          // 1번에서 확인한 Cloud name
  uploadPreset: 'fitto_unsigned', // 2번에서 만든 preset 이름
};
```

## 4. 의존성 설치 후 실행

```bash
cd frontend
npm install            # expo-image-picker 설치
npx expo start -c      # → w
```

## 5. 사용

채팅방 입력바 왼쪽 **📷 버튼** → 사진 선택 → 자동 업로드 후 전송됩니다.

---

## 참고 / 보안
- Unsigned 프리셋은 누구나 그 preset으로 업로드할 수 있으므로, 2-4번처럼 **폴더·포맷·용량을 제한**하세요.
- 더 엄격히 하려면 추후 **백엔드 경유 서명 업로드**(Cloudinary SDK)로 전환할 수 있습니다.
  우리는 메시지에 URL만 저장하므로 저장소(S3 등)로 바꿔도 백엔드 구조는 그대로입니다.
- 설정 전(placeholder)에는 📷 전송 시 "이미지 업로드가 아직 설정되지 않았어요" 안내가 뜹니다.
