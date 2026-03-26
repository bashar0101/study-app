"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Settings, 
  Bell, 
  Lock, 
  LogOut,
  Camera,
  Check
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // In a real app, this would call an API
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
          <User className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Avatar & Quick Info */}
        <Card className="p-6 h-fit space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-indigo-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <Button 
                variant="ghost" 
                className="w-full justify-start text-indigo-600 bg-indigo-50"
            >
              <User className="h-4 w-4 mr-3" />
              Profile Details
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Bell className="h-4 w-4 mr-3" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Lock className="h-4 w-4 mr-3" />
              Security
            </Button>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </Card>

        {/* Right: Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input 
                  value={formData.name} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input 
                  value={formData.email} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Study Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">AI Assistance Level</p>
                  <p className="text-sm text-gray-500">Determine how much help the AI provides during study sessions.</p>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>Supportive</option>
                  <option>Moderate</option>
                  <option>Strict</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch between light and dark themes.</p>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-not-allowed">
                  <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Goal</p>
                  <p className="text-sm text-gray-500">Number of study sessions you aim to complete per week.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={10} className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                  <span className="text-sm text-gray-500">sessions</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
