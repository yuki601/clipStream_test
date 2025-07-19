export interface Translation {
  // Common
  save: string;
  cancel: string;
  ok: string;
  error: string;
  success: string;
  loading: string;
  
  // Navigation
  home: string;
  friends: string;
  upload: string;
  messages: string;
  profile: string;
  search: string;
  notifications: string;
  settings: string;
  trending: string;
  
  // Settings
  settingsTitle: string;
  notificationsSettings: string;
  pushNotifications: string;
  pushNotificationsDesc: string;
  privacySecurity: string;
  privacySettings: string;
  privacySettingsDesc: string;
  accountVisibility: string;
  accountVisibilityDesc: string;
  appearanceLanguage: string;
  darkMode: string;
  darkModeDesc: string;
  language: string;
  storage: string;
  autoDownload: string;
  autoDownloadDesc: string;
  support: string;
  helpCenter: string;
  helpCenterDesc: string;
  contactUs: string;
  contactUsDesc: string;
  rateApp: string;
  rateAppDesc: string;
  account: string;
  logout: string;
  deleteAccount: string;
  deleteAccountDesc: string;
  
  // Messages
  languageChanged: string;
  languageChangedDesc: string;
  settingsSaved: string;
  settingsSavedDesc: string;
}

export const translations: Record<string, Translation> = {
  en: {
    // Common
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    error: "Error",
    success: "Success",
    loading: "Loading",
    
    // Navigation
    home: "Home",
    friends: "Friends",
    upload: "Upload",
    messages: "Messages",
    profile: "Profile",
    search: "Search",
    notifications: "Notifications",
    settings: "Settings",
    trending: "Trending",
    
    // Settings
    settingsTitle: "Settings",
    notificationsSettings: "Notifications",
    pushNotifications: "Push Notifications",
    pushNotificationsDesc: "Get notified about likes, comments, and follows",
    privacySecurity: "Privacy & Security",
    privacySettings: "Privacy Settings",
    privacySettingsDesc: "Manage who can see your clips",
    accountVisibility: "Account Visibility",
    accountVisibilityDesc: "Public profile",
    appearanceLanguage: "Appearance & Language",
    darkMode: "Dark Mode",
    darkModeDesc: "Currently enabled",
    language: "Language",
    storage: "Storage",
    autoDownload: "Auto-download Clips",
    autoDownloadDesc: "Save clips for offline viewing",
    support: "Support",
    helpCenter: "Help Center",
    helpCenterDesc: "Get help and support",
    contactUs: "Contact Us",
    contactUsDesc: "Send feedback or report issues",
    rateApp: "Rate App",
    rateAppDesc: "Rate ClipStream on the App Store",
    account: "Account",
    logout: "Logout",
    deleteAccount: "Delete Account",
    deleteAccountDesc: "Permanently delete your account",
    
    // Messages
    languageChanged: "Language Changed",
    languageChangedDesc: "Language has been updated successfully",
    settingsSaved: "Settings Saved",
    settingsSavedDesc: "Your settings have been saved successfully",
  },
  ja: {
    // Common
    save: "保存",
    cancel: "キャンセル",
    ok: "OK",
    error: "エラー",
    success: "成功",
    loading: "読み込み中",
    
    // Navigation
    home: "ホーム",
    friends: "フレンド",
    upload: "アップロード",
    messages: "メッセージ",
    profile: "プロフィール",
    search: "検索",
    notifications: "通知",
    settings: "設定",
    trending: "トレンド",
    
    // Settings
    settingsTitle: "設定",
    notificationsSettings: "通知",
    pushNotifications: "プッシュ通知",
    pushNotificationsDesc: "いいね、コメント、フォローの通知を受け取る",
    privacySecurity: "プライバシーとセキュリティ",
    privacySettings: "プライバシー設定",
    privacySettingsDesc: "クリップを見ることができる人を管理",
    accountVisibility: "アカウントの表示",
    accountVisibilityDesc: "公開プロフィール",
    appearanceLanguage: "外観と言語",
    darkMode: "ダークモード",
    darkModeDesc: "現在有効",
    language: "言語",
    storage: "ストレージ",
    autoDownload: "クリップの自動ダウンロード",
    autoDownloadDesc: "オフライン視聴用にクリップを保存",
    support: "サポート",
    helpCenter: "ヘルプセンター",
    helpCenterDesc: "ヘルプとサポートを受ける",
    contactUs: "お問い合わせ",
    contactUsDesc: "フィードバックや問題を報告",
    rateApp: "アプリを評価",
    rateAppDesc: "App StoreでClipStreamを評価",
    account: "アカウント",
    logout: "ログアウト",
    deleteAccount: "アカウントを削除",
    deleteAccountDesc: "アカウントを完全に削除",
    
    // Messages
    languageChanged: "言語が変更されました",
    languageChangedDesc: "言語が正常に更新されました",
    settingsSaved: "設定が保存されました",
    settingsSavedDesc: "設定が正常に保存されました",
  },
  ko: {
    // Common
    save: "저장",
    cancel: "취소",
    ok: "확인",
    error: "오류",
    success: "성공",
    loading: "로딩 중",
    
    // Navigation
    home: "홈",
    friends: "친구",
    upload: "업로드",
    messages: "메시지",
    profile: "프로필",
    search: "검색",
    notifications: "알림",
    settings: "설정",
    trending: "트렌딩",
    
    // Settings
    settingsTitle: "설정",
    notificationsSettings: "알림",
    pushNotifications: "푸시 알림",
    pushNotificationsDesc: "좋아요, 댓글, 팔로우 알림 받기",
    privacySecurity: "개인정보 및 보안",
    privacySettings: "개인정보 설정",
    privacySettingsDesc: "클립을 볼 수 있는 사람 관리",
    accountVisibility: "계정 공개 설정",
    accountVisibilityDesc: "공개 프로필",
    appearanceLanguage: "모양 및 언어",
    darkMode: "다크 모드",
    darkModeDesc: "현재 활성화됨",
    language: "언어",
    storage: "저장소",
    autoDownload: "클립 자동 다운로드",
    autoDownloadDesc: "오프라인 시청을 위해 클립 저장",
    support: "지원",
    helpCenter: "도움말 센터",
    helpCenterDesc: "도움말 및 지원 받기",
    contactUs: "문의하기",
    contactUsDesc: "피드백 보내기 또는 문제 신고",
    rateApp: "앱 평가",
    rateAppDesc: "App Store에서 ClipStream 평가하기",
    account: "계정",
    logout: "로그아웃",
    deleteAccount: "계정 삭제",
    deleteAccountDesc: "계정을 영구적으로 삭제",
    
    // Messages
    languageChanged: "언어가 변경되었습니다",
    languageChangedDesc: "언어가 성공적으로 업데이트되었습니다",
    settingsSaved: "설정이 저장되었습니다",
    settingsSavedDesc: "설정이 성공적으로 저장되었습니다",
  },
};

export const getTranslation = (languageCode: string): Translation => {
  return translations[languageCode] || translations.en;
};