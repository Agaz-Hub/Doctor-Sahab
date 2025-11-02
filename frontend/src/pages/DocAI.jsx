import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DocAI = () => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const API_BASE_URL = process.env.DOCAI_URL || "http://localhost:8000";

  // Fetch symptoms list on component mount
  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/symptoms`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setAllSymptoms(data.symptoms || []);
    } catch (error) {
      toast.error("Failed to load symptoms. Please try again later.");
      console.error("Error fetching symptoms:", error);
    }
  };

  // Filter symptoms based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSymptoms([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allSymptoms.filter(
      (symptom) =>
        symptom.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedSymptoms.includes(symptom)
    );
    setFilteredSymptoms(filtered);
    setShowDropdown(filtered.length > 0);
  }, [inputValue, allSymptoms, selectedSymptoms]);

  const handleAddSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setInputValue("");
      setShowDropdown(false);
      setPrediction(null); // Clear previous prediction
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    setPrediction(null); // Clear previous prediction
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast.warning("Please add at least one symptom.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Predicted Disease:", result.predicted_disease);
      console.log("Confidence:", (result.confidence * 100).toFixed(2) + "%");
      console.log("Top 3:", result.top_3_predictions);
      setPrediction(result);
      toast.success("Prediction generated successfully!");
    } catch (error) {
      toast.error("Failed to get prediction. Please try again.");
      console.error("Error predicting disease:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setInputValue("");
    setPrediction(null);
    setFilteredSymptoms([]);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-3">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Powered by Doctor Sahab AI
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            AI Health Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Identify potential health conditions based on your symptoms with
            advanced AI technology from Doctor Sahab
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Search Symptoms
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => inputValue && setShowDropdown(true)}
                placeholder="Type symptoms like fever, headache, cough..."
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
              />

              {/* Dropdown */}
              {showDropdown && filteredSymptoms.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {filteredSymptoms.slice(0, 8).map((symptom, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddSymptom(symptom)}
                      className="px-5 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{symptom}</span>
                    </div>
                  ))}
                  {filteredSymptoms.length > 8 && (
                    <div className="px-5 py-2 text-center text-sm text-gray-500 bg-gray-50">
                      + {filteredSymptoms.length - 8} more results
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Selected Symptoms
                  </label>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {selectedSymptoms.length} symptom
                    {selectedSymptoms.length > 1 ? "s" : ""} added
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-blue-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow transition-shadow"
                  >
                    {symptom}
                    <button
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePredict}
              disabled={loading || selectedSymptoms.length === 0}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all ${
                loading || selectedSymptoms.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Symptoms"
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Prediction Result */}
        {prediction && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Analysis Results
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Based on your symptoms
                </p>
              </div>
            </div>

            {/* Predicted Disease */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-6 mb-6 border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                Primary Diagnosis
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {prediction.predicted_disease}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Confidence Level:
                  </span>
                  <span
                    className={`font-bold ${
                      prediction.confidence >= 0.8
                        ? "text-green-600"
                        : prediction.confidence >= 0.6
                        ? "text-yellow-600"
                        : "text-orange-600"
                    }`}
                  >
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      prediction.confidence >= 0.8
                        ? "bg-green-500"
                        : prediction.confidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top 3 Predictions */}
            {prediction.top_3_predictions &&
              prediction.top_3_predictions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Alternative Diagnoses
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {prediction.top_3_predictions.map((pred, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-lg text-sm">
                            #{index + 1}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-base leading-tight">
                          {pred.disease}
                        </h4>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gray-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                    Medical Disclaimer
                  </h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    This AI prediction is for{" "}
                    <span className="font-medium">
                      informational purposes only
                    </span>
                    and should not replace professional medical advice. Always
                    consult with a qualified healthcare provider for accurate
                    diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">How It Works</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Search and select symptoms from our database",
                "Add multiple symptoms for better accuracy",
                "AI analyzes patterns and predicts conditions",
                "Consult a healthcare professional with results",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5 font-bold">✓</span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Key Features</h3>
            </div>
            <ul className="space-y-3">
              {[
                "AI-powered predictions",
                "Fast and accurate results",
                "Comprehensive disease coverage",
                "User-friendly interface",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                >
                  <span className="mt-0.5">•</span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocAI;
