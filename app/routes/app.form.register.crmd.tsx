import { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import {
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Camera,
  CreditCard,
  Bed,
  Utensils,
  Trophy,
  ExternalLink,
} from "lucide-react";

// Type definitions
type FoodPreference = "Jain" | "Vegetarian" | "Non-Vegetarian";

interface FormData {
  collegeName: string;
  state: string;
  city: string;
  participant1Name: string;
  participant1Email: string;
  participant1Contact: string;
  participant1IdCard: File | null;
  participant2Name: string;
  participant2Email: string;
  participant2Contact: string;
  participant2IdCard: File | null;
  paymentScreenshot: File | null;
  accommodationNecessary: boolean;
  foodPreference: FoodPreference;
  pastDebateExperience: string;
}

interface DragActiveState {
  [key: string]: boolean;
}

interface FileUploadFieldProps {
  field: keyof FormData;
  label: string;
  accept: string;
  icon: React.ComponentType<{ className?: string }>;
  formData: FormData;
  dragActive: DragActiveState;
  onFileUpload: (field: keyof FormData, file: File) => void;
  onDrag: (e: DragEvent<HTMLDivElement>, field: keyof FormData) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, field: keyof FormData) => void;
}

export default function Participate(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    collegeName: "",
    state: "",
    city: "",
    participant1Name: "",
    participant1Email: "",
    participant1Contact: "",
    participant1IdCard: null,
    participant2Name: "",
    participant2Email: "",
    participant2Contact: "",
    participant2IdCard: null,
    paymentScreenshot: null,
    accommodationNecessary: false,
    foodPreference: "Vegetarian",
    pastDebateExperience: "",
  });

  const [dragActive, setDragActive] = useState<DragActiveState>({});

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | FoodPreference
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof FormData, file: File): void => {
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleDrag = (
    e: DragEvent<HTMLDivElement>,
    field: keyof FormData
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [field]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    field: keyof FormData
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [field]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(field, e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const FileUploadField: React.FC<FileUploadFieldProps> = ({
    field,
    label,
    accept,
    icon: Icon,
    formData,
    dragActive,
    onFileUpload,
    onDrag,
    onDrop,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90 flex items-center space-x-2">
        <Icon className="h-4 w-4 text-indigo-400" />
        <span>{label}</span>
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          dragActive[field]
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-white/20 hover:border-white/40"
        }`}
        onDragEnter={(e) => onDrag(e, field)}
        onDragLeave={(e) => onDrag(e, field)}
        onDragOver={(e) => onDrag(e, field)}
        onDrop={(e) => onDrop(e, field)}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload(field, e.target.files[0]);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-white/40 mb-2" />
          <p className="text-sm text-white/70">
            {(formData[field] as File)?.name ||
              "Drop file here or click to upload"}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {accept === "image/*"
              ? "PNG, JPG, JPEG up to 5MB"
              : "PNG, JPG, PDF up to 5MB"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto mt-[50px]">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">
              National Level Competition
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              CRMD 2024
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            Conceicao Rodrigues Memorial Debate
          </h2>

          <p className="text-lg text-white/80 mb-4">
            🗣️ Unleash your debating prowess! Secure your spot at CRMD 2024 🎯🎙️
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-white/90 mb-2">
              <strong>Hosted by:</strong> Fr. Conceicao Rodrigues College of
              Engineering
            </p>
            <p className="text-white/90 mb-4">
              <strong>Theme:</strong> Akrasia: The Moral Maze of Conflict and
              Coalition
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="https://pay.fragnel.edu.in/CRCE/initPay.php?p=crmd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CreditCard className="h-5 w-5" />
                <span>Payment Link</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <div className="text-sm text-white/70">
                <p>For inquiries: Juvana Dsouza</p>
                <p>📞 +91 70451 48347</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Registration Form
          </h3>

          {/* College Information */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white/90 mb-6 flex items-center space-x-2">
              <Building className="h-5 w-5 text-indigo-400" />
              <span>College Information</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  College Name
                </label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("collegeName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter college name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("state", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("city", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>
          </div>

          {/* Participant 1 */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white/90 mb-6 flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-400" />
              <span>Participant 1 Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.participant1Name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant1Name", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.participant1Email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant1Email", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.participant1Contact}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant1Contact", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>

            <FileUploadField
              field="participant1IdCard"
              label="College ID Card"
              accept="image/*"
              icon={Camera}
              formData={formData}
              dragActive={dragActive}
              onFileUpload={handleFileUpload}
              onDrag={handleDrag}
              onDrop={handleDrop}
            />
          </div>

          {/* Participant 2 */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white/90 mb-6 flex items-center space-x-2">
              <User className="h-5 w-5 text-pink-400" />
              <span>Participant 2 Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.participant2Name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant2Name", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.participant2Email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant2Email", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.participant2Contact}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("participant2Contact", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>

            <FileUploadField
              field="participant2IdCard"
              label="College ID Card"
              accept="image/*"
              icon={Camera}
              formData={formData}
              dragActive={dragActive}
              onFileUpload={handleFileUpload}
              onDrag={handleDrag}
              onDrop={handleDrop}
            />
          </div>

          {/* Payment Screenshot */}
          <div className="mb-10">
            <FileUploadField
              field="paymentScreenshot"
              label="Payment Screenshot"
              accept="image/*,.pdf"
              icon={CreditCard}
              formData={formData}
              dragActive={dragActive}
              onFileUpload={handleFileUpload}
              onDrag={handleDrag}
              onDrop={handleDrop}
            />
          </div>

          {/* Additional Information */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white/90 mb-6">
              Additional Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Accommodation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90 flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-indigo-400" />
                  <span>Accommodation Necessary</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accommodation"
                      checked={formData.accommodationNecessary === true}
                      onChange={() =>
                        handleInputChange("accommodationNecessary", true)
                      }
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-white/20 bg-white/10"
                    />
                    <span className="text-white/90">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accommodation"
                      checked={formData.accommodationNecessary === false}
                      onChange={() =>
                        handleInputChange("accommodationNecessary", false)
                      }
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-white/20 bg-white/10"
                    />
                    <span className="text-white/90">No</span>
                  </label>
                </div>
              </div>

              {/* Food Preference */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90 flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-green-400" />
                  <span>Food Preference</span>
                </label>
                <select
                  value={formData.foodPreference}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(
                      "foodPreference",
                      e.target.value as FoodPreference
                    )
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="Vegetarian" className="bg-slate-800">
                    Vegetarian
                  </option>
                  <option value="Non-Vegetarian" className="bg-slate-800">
                    Non-Vegetarian
                  </option>
                  <option value="Jain" className="bg-slate-800">
                    Jain
                  </option>
                </select>
              </div>
            </div>

            {/* Past Debate Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90 flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Past Oxford Style Debate Experience</span>
              </label>
              <textarea
                value={formData.pastDebateExperience}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange("pastDebateExperience", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Describe your past debate experience, competitions won, or participation details..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <span>Register for CRMD 2024</span>
              <Trophy className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
