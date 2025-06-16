import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "sonner";
import { auth } from "~/lib/auth.server"; // Your better-auth instance
import {
  User,
  Mail,
  Lock,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "updateProfile": {
        const name = formData.get("name") as string;

        if (!name || name.trim().length < 2) {
          return json(
            { error: "Name must be at least 2 characters long" },
            { status: 400 }
          );
        }

        // Add request parameter for authentication
        const result = await auth.api.updateUser({
          headers: request.headers,
          body: { name: name },
        });

        if (!result) {
          throw new Error("Failed to update profile");
        }

        return json({ success: true, message: "Profile updated successfully" });
      }

      case "changeEmail": {
        const newEmail = formData.get("email") as string;

        // Add request parameter - this was missing!
        const result = await auth.api.changeEmail({
          body: { newEmail: newEmail },
          headers: request.headers, // Add this line
        });

        if (!result) {
          throw new Error("Failed to change email");
        }

        return json({ success: true, message: "Email verification sent" });
      }

      case "changePassword": {
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        // Add request parameter - this was missing!
        const result = await auth.api.changePassword({
          body: { currentPassword: currentPassword, newPassword: newPassword },
          headers: request.headers, // Add this line
        });

        if (!result) {
          throw new Error("Failed to change password");
        }

        return json({
          success: true,
          message: "Password updated successfully",
        });
      }

      case "deleteAccount": {
        // Add request parameter - this was missing!
        const result = await auth.api.deleteUser({
          body: {},
          headers: request.headers, // Add this line
        });

        if (!result) {
          throw new Error("Failed to delete account");
        }

        return json({ success: true, message: "Account deleted successfully" });
      }

      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return json(
      {
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 400 }
    );
  }
}

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lastActionData, setLastActionData] = useState<any>(null);

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications based on action results - only when new data arrives
  useEffect(() => {
    if (actionData && actionData !== lastActionData) {
      if ("success" in actionData) {
        toast.success(actionData.message);
      } else if ("error" in actionData) {
        toast.error(actionData.error);
      }
      setLastActionData(actionData);
    }
  }, [actionData, lastActionData]);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#7e57c2]/10 rounded-xl border border-[#7e57c2]/20">
              <Settings className="text-[#7e57c2]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#f0f0f0] mb-1">
                Account Settings
              </h1>
              <p className="text-slate-400 text-sm">
                Manage your account preferences and security settings
              </p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="space-y-8">
          {/* Profile Section */}
          <Card className="bg-[#1e1e1e]/90 backdrop-blur-lg border-slate-700/40 shadow-2xl hover:shadow-[#7e57c2]/5 transition-all duration-300 hover:border-slate-600/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-[#f0f0f0] text-xl flex items-center gap-3">
                <div className="p-2 bg-[#7e57c2]/10 rounded-lg">
                  <User className="text-[#7e57c2]" size={20} />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm ml-11">
                Update your display name and personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Form method="post" className="space-y-6">
                <input type="hidden" name="intent" value="updateProfile" />
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-[#f0f0f0] text-sm font-medium flex items-center gap-2"
                  >
                    Full Name
                    <span className="text-xs text-slate-500">(Required)</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="bg-slate-800/60 border-slate-600/60 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 transition-all duration-200 hover:border-slate-500/70 h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-all duration-200 flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-lg hover:shadow-[#7e57c2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card className="bg-[#1e1e1e]/90 backdrop-blur-lg border-slate-700/40 shadow-2xl hover:shadow-[#7e57c2]/5 transition-all duration-300 hover:border-slate-600/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-[#f0f0f0] text-xl flex items-center gap-3">
                <div className="p-2 bg-[#7e57c2]/10 rounded-lg">
                  <Mail className="text-[#7e57c2]" size={20} />
                </div>
                Email Address
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm ml-11">
                Change your email address - verification required
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Form method="post" className="space-y-6">
                <input type="hidden" name="intent" value="changeEmail" />
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-[#f0f0f0] text-sm font-medium flex items-center gap-2"
                  >
                    New Email Address
                    <span className="text-xs text-slate-500">
                      (Verification required)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter new email address"
                    className="bg-slate-800/60 border-slate-600/60 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 transition-all duration-200 hover:border-slate-500/70 h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-all duration-200 flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-lg hover:shadow-[#7e57c2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail size={16} />
                  {isSubmitting ? "Sending..." : "Update Email"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="bg-[#1e1e1e]/90 backdrop-blur-lg border-slate-700/40 shadow-2xl hover:shadow-[#7e57c2]/5 transition-all duration-300 hover:border-slate-600/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-[#f0f0f0] text-xl flex items-center gap-3">
                <div className="p-2 bg-[#7e57c2]/10 rounded-lg">
                  <Lock className="text-[#7e57c2]" size={20} />
                </div>
                Password & Security
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm ml-11">
                Keep your account secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Form method="post" className="space-y-6">
                <input type="hidden" name="intent" value="changePassword" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="currentPassword"
                      className="text-[#f0f0f0] text-sm font-medium flex items-center gap-2"
                    >
                      Current Password
                      <span className="text-xs text-slate-500">(Required)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current password"
                        className="bg-slate-800/60 border-slate-600/60 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 pr-12 transition-all duration-200 hover:border-slate-500/70 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#f0f0f0] transition-colors p-1 rounded-md hover:bg-slate-700/50"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="newPassword"
                      className="text-[#f0f0f0] text-sm font-medium flex items-center gap-2"
                    >
                      New Password
                      <span className="text-xs text-slate-500">
                        (Min 8 characters)
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        className="bg-slate-800/60 border-slate-600/60 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 pr-12 transition-all duration-200 hover:border-slate-500/70 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#f0f0f0] transition-colors p-1 rounded-md hover:bg-slate-700/50"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-all duration-200 flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-lg hover:shadow-[#7e57c2]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock size={16} />
                    {isSubmitting ? "Updating..." : "Change Password"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-950/20 backdrop-blur-lg border-red-800/40 shadow-2xl hover:shadow-red-500/5 transition-all duration-300 hover:border-red-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-red-400 text-xl flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                  <Trash2 className="text-red-400" size={20} />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-300/80 text-sm ml-11">
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-600/60 text-red-400 hover:bg-red-600/10 hover:border-red-500 transition-all duration-200 px-6 py-2.5 rounded-lg font-medium"
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-red-950/30 border border-red-800/30 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="text-red-400 text-2xl mt-0.5">⚠️</div>
                      <div className="flex-1">
                        <p className="text-red-300 font-semibold text-base mb-2">
                          This action cannot be undone
                        </p>
                        <p className="text-red-200/80 text-sm leading-relaxed">
                          All your data will be permanently deleted from our
                          servers. This includes your profile, settings, and any
                          associated content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Form method="post" className="flex-1">
                      <input
                        type="hidden"
                        name="intent"
                        value="deleteAccount"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        {isSubmitting ? "Deleting..." : "Confirm Delete"}
                      </Button>
                    </Form>

                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="flex-1 border-slate-600/60 text-[#f0f0f0] hover:bg-slate-700/50 transition-all duration-200 px-6 py-2.5 rounded-lg font-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
