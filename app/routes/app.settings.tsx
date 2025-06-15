import { useState } from "react";
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

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications based on action results
  if (actionData && "success" in actionData) {
    toast.success(actionData.message);
  } else if (actionData && "error" in actionData) {
    toast.error(actionData.error);
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-[#7e57c2]" size={28} />
            <h1 className="text-3xl font-bold text-[#f0f0f0]">
              Account Settings
            </h1>
          </div>
          <p className="text-slate-400">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="bg-[#1e1e1e]/80 backdrop-blur-sm border-slate-700/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#f0f0f0] text-lg flex items-center gap-2">
                <User className="text-[#7e57c2]" size={20} />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Update your display name and personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="updateProfile" />
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[#f0f0f0] text-sm font-medium"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="bg-slate-800/50 border-slate-600/50 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 transition-colors"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card className="bg-[#1e1e1e]/80 backdrop-blur-sm border-slate-700/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#f0f0f0] text-lg flex items-center gap-2">
                <Mail className="text-[#7e57c2]" size={20} />
                Email Address
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Change your email address - verification required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="changeEmail" />
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[#f0f0f0] text-sm font-medium"
                  >
                    New Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter new email address"
                    className="bg-slate-800/50 border-slate-600/50 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 transition-colors"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  {isSubmitting ? "Sending..." : "Update Email"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="bg-[#1e1e1e]/80 backdrop-blur-sm border-slate-700/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#f0f0f0] text-lg flex items-center gap-2">
                <Lock className="text-[#7e57c2]" size={20} />
                Password & Security
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Keep your account secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="changePassword" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-[#f0f0f0] text-sm font-medium"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current password"
                        className="bg-slate-800/50 border-slate-600/50 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 pr-10 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#f0f0f0] transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-[#f0f0f0] text-sm font-medium"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        className="bg-slate-800/50 border-slate-600/50 text-[#f0f0f0] focus:ring-2 focus:ring-[#7e57c2]/50 focus:border-[#7e57c2] placeholder:text-slate-500 pr-10 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#f0f0f0] transition-colors"
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#7e57c2] hover:bg-[#6d48b8] text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Lock size={16} />
                  {isSubmitting ? "Updating..." : "Change Password"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-950/10 border-red-800/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                <Trash2 className="text-red-400" size={20} />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-300/70 text-sm">
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-500 transition-colors"
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/20 border border-red-800/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-red-400 text-lg">⚠️</div>
                      <div>
                        <p className="text-red-300 font-medium text-sm mb-1">
                          This action cannot be undone
                        </p>
                        <p className="text-red-200/70 text-sm">
                          All your data will be permanently deleted from our
                          servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Form method="post" className="flex-1">
                      <input
                        type="hidden"
                        name="intent"
                        value="deleteAccount"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        {isSubmitting ? "Deleting..." : "Confirm Delete"}
                      </Button>
                    </Form>

                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      className="flex-1 border-slate-600/50 text-[#f0f0f0] hover:bg-slate-700/50 transition-colors"
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
