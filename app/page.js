"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const Home = () => {
  // Predefined categories with colors
  const categories = [
    { id: "language", name: "Language test", color: "#bce7fd" },
    { id: "gpa", name: "GPA", color: "#b0db43" },
    { id: "practice", name: "Internship", color: "#db2763" },
    { id: "activity", name: "Research", color: "#c492b1" },
  ];

  // Term related states
  const [showTermInput, setShowTermInput] = useState(false);
  const [newTermName, setNewTermName] = useState("");
  const [terms, setTerms] = useState([]);

  // Handle the button click to show term input
  const handleNewTermClick = () => {
    setShowTermInput(true);
  };

  // Handle term submission
  const handleTermSubmit = (e) => {
    e.preventDefault();
    if (newTermName.trim()) {
      // Add the new term to the list of terms
      setTerms((prevTerms) => [
        {
          id: Date.now(),
          name: newTermName,
          tasks: [],
          showTaskModal: false,
          newTask: { category: "", summary: "", dueDate: null },
        },
        ...prevTerms, // Add new term at the beginning
      ]);
      setNewTermName("");
      setShowTermInput(false);
    }
  };

  // Handle task form input changes
  const handleTaskInputChange = (termId, e) => {
    const { name, value } = e.target;
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              newTask: { ...term.newTask, [name]: value },
            }
          : term
      )
    );
  };

  // Handle due date selection
  const handleDateChange = (termId, date) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              newTask: { ...term.newTask, dueDate: date },
            }
          : term
      )
    );
  };

  // Handle category selection
  const handleCategorySelect = (termId, categoryId) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              newTask: { ...term.newTask, category: categoryId },
            }
          : term
      )
    );
  };

  // Toggle task modal for a specific term
  const toggleTaskModal = (termId, show) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              showTaskModal: show,
              newTask: show
                ? { category: "", summary: "", dueDate: null }
                : term.newTask,
            }
          : term
      )
    );
  };

  // Handle task submission for a specific term
  const handleTaskSubmit = (termId, e) => {
    e.preventDefault();
    setTerms((prevTerms) =>
      prevTerms.map((term) => {
        if (
          term.id === termId &&
          term.newTask?.category &&
          term.newTask?.summary
        ) {
          return {
            ...term,
            tasks: [...term.tasks, { ...term.newTask, id: Date.now() }],
            showTaskModal: false,
            newTask: { category: "", summary: "", dueDate: null },
          };
        }
        return term;
      })
    );
  };

  // Get category details by id
  const getCategoryById = (categoryId) => {
    return (
      categories.find((cat) => cat.id === categoryId) || {
        name: "",
        color: "#cccccc",
      }
    );
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "MMM d");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {/* Always visible New Term button or input field */}
      <div className="mb-10">
        {!showTermInput ? (
          <Button
            onClick={handleNewTermClick}
            className="px-4 py-2 text-xl rounded-md hover:bg-gray-100"
          >
            + New Term
          </Button>
        ) : (
          <form onSubmit={handleTermSubmit} className="w-64">
            <input
              type="text"
              value={newTermName}
              onChange={(e) => setNewTermName(e.target.value)}
              placeholder="Enter term (e.g. Fall 2025)"
              className="w-full px-4 py-2 border border-blue-500 rounded-md focus:outline-none"
              autoFocus
            />
          </form>
        )}
      </div>

      {/* Terms and their Task Lists */}
      {terms.map((term) => (
        <div key={term.id} className="mb-16 border-t pt-8">
          {/* Term Banner */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-primary">{term.name}</h1>
          </div>

          {/* Task Headers */}
          <div className="mb-6">
            <div className="flex">
              <div className="flex-1 text-2xl">Category</div>
              <div className="flex-1 text-2xl">Task Summary</div>
              <div className="flex-1 text-2xl">Due Date</div>
            </div>
          </div>

          {/* Task List */}
          {term.tasks.length > 0 && (
            <div className="mb-8">
              {term.tasks.map((task) => (
                <div key={task.id} className="flex py-2">
                  <div className="flex-1 flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor: getCategoryById(task.category).color,
                      }}
                    ></div>
                    {getCategoryById(task.category).name}
                  </div>
                  <div className="flex-1">{task.summary}</div>
                  <div className="flex-1">{formatDate(task.dueDate)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Add Task Button */}
          <button
            onClick={() => toggleTaskModal(term.id, true)}
            className="px-4 py-2 text-xl text-secondary hover:bg-gray-100"
          >
            + Add Task
          </button>

          {/* Task Modal */}
          {term.showTaskModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">
                  Add New Task for {term.name}
                </h2>

                <form onSubmit={(e) => handleTaskSubmit(term.id, e)}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className={`flex items-center py-2 px-3 rounded-full border ${
                              term.newTask?.category === category.id
                                ? "border-blue-500 ring-2 ring-blue-300"
                                : "border-gray-300"
                            }`}
                            onClick={() =>
                              handleCategorySelect(term.id, category.id)
                            }
                          >
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span>{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Summary
                      </label>
                      <input
                        type="text"
                        name="summary"
                        value={term.newTask?.summary || ""}
                        onChange={(e) => handleTaskInputChange(term.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {term.newTask?.dueDate ? (
                              formatDate(term.newTask.dueDate)
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={term.newTask?.dueDate}
                            onSelect={(date) => handleDateChange(term.id, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleTaskModal(term.id, false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
