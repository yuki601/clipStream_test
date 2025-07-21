# ClipStream

動画クリップ共有アプリのフロントエンド（React Native/Expo）とバックエンド（Supabase）の統合版です。

## 機能

- 📱 動画クリップの閲覧・アップロード
- 🔐 ユーザー認証（サインアップ・サインイン）
- 👥 ユーザーフォロー機能
- 🏷️ ゲームタグによる分類
- 📊 トレンドクリップ表示
- 🔒 プライバシー設定（公開・フォロワーのみ・非公開）
- ⏰ クリップの有効期限設定

## 技術スタック

### フロントエンド
- React Native (Expo)
- TypeScript
- React Query (TanStack Query)
- NativeWind (Tailwind CSS)
- Zustand (状態管理)

### バックエンド
- Supabase
  - PostgreSQL データベース
  - 認証システム
  - リアルタイム機能
  - ストレージ

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - Anon (public) key

### 2. データベーススキーマの設定

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase/schema.sql`の内容をコピーして実行

### 3. 環境変数の設定

1. プロジェクトルートに`.env`ファイルを作成
2. 以下の内容を追加：

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 依存関係のインストール

```bash
npm install
```

### 5. アプリの起動

```bash
# 開発サーバーを起動
npm start

# Web版を起動
npm run start-web
```

## プロジェクト構造

```
├── app/                    # Expo Router ページ
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # ホーム画面
│   │   ├── upload.tsx     # アップロード画面
│   │   ├── profile.tsx    # プロフィール画面
│   │   └── ...
│   └── _layout.tsx        # ルートレイアウト
├── components/            # 再利用可能なコンポーネント
├── lib/                   # ユーティリティとAPI
│   ├── supabase.ts        # Supabase設定
│   └── api.ts             # API関数
├── hooks/                 # カスタムフック
│   └── useAuth.tsx        # 認証フック
├── types/                 # TypeScript型定義
├── constants/             # 定数
├── mocks/                 # モックデータ
└── supabase/              # Supabase関連ファイル
    └── schema.sql         # データベーススキーマ
```

## API エンドポイント

### クリップ関連
- `GET /clips` - すべてのクリップを取得
- `POST /clips` - 新しいクリップを作成
- `PUT /clips/:id` - クリップを更新
- `DELETE /clips/:id` - クリップを削除

### ユーザー関連
- `GET /users/:id` - ユーザー情報を取得
- `PUT /users/:id` - ユーザー情報を更新
- `POST /users/follow` - ユーザーをフォロー
- `POST /users/unfollow` - フォローを解除

### 認証関連
- `POST /auth/signup` - サインアップ
- `POST /auth/signin` - サインイン
- `POST /auth/signout` - サインアウト

## データベース設計

### users テーブル
- `id` - ユーザーID（UUID）
- `username` - ユーザー名
- `display_name` - 表示名
- `avatar` - アバター画像URL
- `bio` - 自己紹介
- `followers` - フォロワー数
- `following` - フォロー数
- `clips` - クリップ数

### clips テーブル
- `id` - クリップID（UUID）
- `title` - タイトル
- `url` - 動画URL
- `thumbnail_url` - サムネイルURL
- `duration` - 動画の長さ（秒）
- `source` - 動画ソース（youtube, twitch, medal, local, other）
- `game_tags` - ゲームタグ配列
- `created_at` - 作成日時
- `expires_at` - 有効期限
- `user_id` - 投稿者ID
- `username` - 投稿者名
- `user_avatar` - 投稿者アバター
- `view_count` - 視聴回数
- `is_archived` - アーカイブ済みか
- `is_pinned` - ピン留め済みか
- `visibility` - 公開設定（public, followers, private）

### follows テーブル
- `id` - フォローID（UUID）
- `follower_id` - フォロワーID
- `following_id` - フォロー対象ID
- `created_at` - フォロー日時

## セキュリティ

- Row Level Security (RLS) を有効化
- ユーザーは自分のデータのみ編集可能
- 公開設定に応じたアクセス制御
- JWT認証によるセッション管理

## 今後の改善点

- [ ] 動画プレビュー機能
- [ ] コメント機能
- [ ] いいね機能
- [ ] 通知システム
- [ ] 検索機能の改善
- [ ] 動画の自動処理（サムネイル生成、長さ取得）
- [ ] プッシュ通知
- [ ] オフライン対応

## ライセンス

MIT License 