import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Download, 
  Trash2, 
  LogOut, 
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Star,
  Languages,
  Check,
  Save
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/constants/languages";
import { useLanguage } from "@/hooks/use-language";

export default function SettingsScreen() {
  const router = useRouter();
  const { currentLanguage, translations, changeLanguage } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      translations.logout,
      "Are you sure you want to logout?",
      [
        { text: translations.cancel, style: "cancel" },
        { 
          text: translations.logout, 
          style: "destructive",
          onPress: () => {
            Alert.alert("Logged out", "You have been logged out successfully");
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      translations.deleteAccount,
      "This action cannot be undone. All your clips and data will be permanently deleted.",
      [
        { text: translations.cancel, style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Account Deleted", "Your account has been deleted");
          }
        }
      ]
    );
  };

  const handleLanguageChange = async (languageCode: LanguageCode) => {
    await changeLanguage(languageCode);
    setShowLanguageOptions(false);
    setHasUnsavedChanges(true);
    Alert.alert(translations.languageChanged, translations.languageChangedDesc);
  };

  const handleSaveSettings = () => {
    // In a real app, you would save all settings to backend/storage here
    setHasUnsavedChanges(false);
    Alert.alert(translations.settingsSaved, translations.settingsSavedDesc);
  };

  const handleSettingChange = (setter: (value: boolean) => void, value: boolean) => {
    setter(value);
    setHasUnsavedChanges(true);
  };

  const getCurrentLanguageName = () => {
    return SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName || 'English';
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true, 
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <ChevronRight color={Colors.textSecondary} size={20} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Header
        title={translations.settingsTitle}
        showSearch={false}
        showNotification={false}
        showBack={true}
        showHome={true}
      />

      {/* Save Button */}
      {hasUnsavedChanges && (
        <View style={styles.saveButtonContainer}>
          <Pressable style={styles.saveButton} onPress={handleSaveSettings}>
            <Save color={Colors.text} size={18} style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>{translations.save}</Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.notificationsSettings}</Text>
          <SettingItem
            icon={<Bell color={Colors.text} size={22} />}
            title={translations.pushNotifications}
            subtitle={translations.pushNotificationsDesc}
            showArrow={false}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => handleSettingChange(setNotificationsEnabled, value)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            }
          />
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.privacySecurity}</Text>
          <SettingItem
            icon={<Shield color={Colors.text} size={22} />}
            title={translations.privacySettings}
            subtitle={translations.privacySettingsDesc}
            onPress={() => Alert.alert("Privacy", "Privacy settings would open here")}
          />
          <SettingItem
            icon={<Globe color={Colors.text} size={22} />}
            title={translations.accountVisibility}
            subtitle={translations.accountVisibilityDesc}
            onPress={() => Alert.alert("Visibility", "Account visibility settings would open here")}
          />
        </View>

        {/* Appearance & Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.appearanceLanguage}</Text>
          <SettingItem
            icon={<Moon color={Colors.text} size={22} />}
            title={translations.darkMode}
            subtitle={translations.darkModeDesc}
            showArrow={false}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={(value) => handleSettingChange(setDarkMode, value)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            }
          />
          <SettingItem
            icon={<Languages color={Colors.text} size={22} />}
            title={translations.language}
            subtitle={getCurrentLanguageName()}
            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
            showArrow={false}
          />
          {showLanguageOptions && (
            <View style={styles.languageOptions}>
              {SUPPORTED_LANGUAGES.map((language) => (
                <Pressable
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === language.code && styles.selectedLanguageOption
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.nativeName}</Text>
                    <Text style={styles.languageEnglishName}>{language.name}</Text>
                  </View>
                  {currentLanguage === language.code && (
                    <Check color={Colors.primary} size={20} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.storage}</Text>
          <SettingItem
            icon={<Download color={Colors.text} size={22} />}
            title={translations.autoDownload}
            subtitle={translations.autoDownloadDesc}
            showArrow={false}
            rightComponent={
              <Switch
                value={autoDownload}
                onValueChange={(value) => handleSettingChange(setAutoDownload, value)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            }
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.support}</Text>
          <SettingItem
            icon={<HelpCircle color={Colors.text} size={22} />}
            title={translations.helpCenter}
            subtitle={translations.helpCenterDesc}
            onPress={() => Alert.alert("Help", "Help center would open here")}
          />
          <SettingItem
            icon={<MessageSquare color={Colors.text} size={22} />}
            title={translations.contactUs}
            subtitle={translations.contactUsDesc}
            onPress={() => Alert.alert("Contact", "Contact form would open here")}
          />
          <SettingItem
            icon={<Star color={Colors.text} size={22} />}
            title={translations.rateApp}
            subtitle={translations.rateAppDesc}
            onPress={() => Alert.alert("Rate", "App Store rating would open here")}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.account}</Text>
          <SettingItem
            icon={<LogOut color={Colors.error} size={22} />}
            title={translations.logout}
            onPress={handleLogout}
            showArrow={false}
          />
          <SettingItem
            icon={<Trash2 color={Colors.error} size={22} />}
            title={translations.deleteAccount}
            subtitle={translations.deleteAccountDesc}
            onPress={handleDeleteAccount}
            showArrow={false}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ClipStream v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 ClipStream. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  saveButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageOptions: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedLanguageOption: {
    backgroundColor: `${Colors.primary}20`,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  languageEnglishName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 5,
  },
});