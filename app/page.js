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
import { CalendarIcon, FileText, Mail } from "lucide-react";

const Home = () => {
  // Categories state with predefined categories
  const [categories, setCategories] = useState([
    { id: "language", name: "Language test", color: "#bce7fd" },
    { id: "gpa", name: "GPA", color: "#b0db43" },
    { id: "practice", name: "Internship", color: "#db2763" },
    { id: "activity", name: "Research", color: "#c492b1" },
  ]);

  // Custom category states
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Term related states
  const [showTermInput, setShowTermInput] = useState(false);
  const [newTermName, setNewTermName] = useState("");
  const [terms, setTerms] = useState([]);
  const [editingTermId, setEditingTermId] = useState(null);
  const [editingTermName, setEditingTermName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    type: null,
    id: null,
  });

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 30);
    const lightness = 65 + Math.floor(Math.random() * 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleCustomCategorySubmit = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `custom-${Date.now()}`,
        name: newCategoryName,
        color: generateRandomColor(),
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      setShowCustomCategoryInput(false);
    }
  };

  const handleNewTermClick = () => {
    setShowTermInput(true);
  };

  const handleTermSubmit = (e) => {
    e.preventDefault();
    if (newTermName.trim()) {
      setTerms((prevTerms) => [
        {
          id: Date.now(),
          name: newTermName,
          tasks: [],
          showTaskModal: false,
          newTask: { category: "", summary: "", dueDate: null },
        },
        ...prevTerms,
      ]);
      setNewTermName("");
      setShowTermInput(false);
    }
  };

  const handleEditTerm = (term) => {
    setEditingTermId(term.id);
    setEditingTermName(term.name);
  };

  const handleUpdateTerm = () => {
    if (editingTermName.trim()) {
      setTerms((prevTerms) =>
        prevTerms.map((term) =>
          term.id === editingTermId ? { ...term, name: editingTermName } : term
        )
      );
      setEditingTermId(null);
      setEditingTermName("");
    }
  };

  const handleDeleteTerm = (termId) => {
    setTerms((prevTerms) => prevTerms.filter((term) => term.id !== termId));
    setShowDeleteConfirm({ type: null, id: null });
  };

  const handleEditTask = (termId, task) => {
    setEditingTaskId(task.id);
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              showTaskModal: true,
              newTask: { ...task },
            }
          : term
      )
    );
  };

  const handleDeleteTask = (termId, taskId) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? { ...term, tasks: term.tasks.filter((task) => task.id !== taskId) }
          : term
      )
    );
    setShowDeleteConfirm({ type: null, id: null });
  };

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

  const handleTaskSubmit = (termId, e) => {
    e.preventDefault();
    setTerms((prevTerms) =>
      prevTerms.map((term) => {
        if (
          term.id === termId &&
          term.newTask?.category &&
          term.newTask?.summary
        ) {
          if (editingTaskId) {
            // Update existing task
            return {
              ...term,
              tasks: term.tasks.map((task) =>
                task.id === editingTaskId
                  ? { ...term.newTask, id: task.id }
                  : task
              ),
              showTaskModal: false,
              newTask: { category: "", summary: "", dueDate: null },
            };
          } else {
            // Add new task
            return {
              ...term,
              tasks: [...term.tasks, { ...term.newTask, id: Date.now() }],
              showTaskModal: false,
              newTask: { category: "", summary: "", dueDate: null },
            };
          }
        }
        return term;
      })
    );
    setEditingTaskId(null);
  };

  const getCategoryById = (categoryId) => {
    return (
      categories.find((cat) => cat.id === categoryId) || {
        name: "",
        color: "#cccccc",
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "MMM d");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {/* Always visible New Term button or input field */}
      <div className="mb-10 flex items-center justify-between">
        <div>
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              /* 添加Report功能 */
            }}
          >
            <FileText className="w-4 h-4" />
            Report
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              /* 添加Email功能 */
            }}
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
        </div>
      </div>

      {/* Terms and their Task Lists */}
      {terms.map((term) => (
        <div key={term.id} className="mb-16 border-t pt-8">
          {/* Term Banner */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {editingTermId === term.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingTermName}
                    onChange={(e) => setEditingTermName(e.target.value)}
                    className="text-3xl font-bold px-2 border border-gray-300 rounded"
                    autoFocus
                  />
                  <Button onClick={handleUpdateTerm} variant="outline">
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-primary">
                    {term.name}
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() => handleEditTerm(term)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() =>
                        setShowDeleteConfirm({ type: "term", id: term.id })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Task Headers */}
          <div className="mb-6">
            <div className="flex">
              <div className="flex-1 text-2xl">Category</div>
              <div className="flex-2 text-2xl gap-8">Task Summary</div>
              <div className="flex-1 text-2xl">Due Date</div>
              <div className="w-[200px]"></div>
            </div>
          </div>

          {/* Task List */}
          {term.tasks.length > 0 && (
            <div className="mb-8">
              {term.tasks.map((task) => (
                <div key={task.id} className="flex py-2 items-center">
                  <div className="flex-1 flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor: getCategoryById(task.category).color,
                      }}
                    ></div>
                    {getCategoryById(task.category).name}
                  </div>
                  <div className="flex-2 gap-8">{task.summary}</div>
                  <div className="flex-1 ">🗓️ {formatDate(task.dueDate)}</div>
                  <div className="flex gap-2 w-[200px]">
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() => handleEditTask(term.id, task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() =>
                        setShowDeleteConfirm({
                          type: "task",
                          id: task.id,
                          termId: term.id,
                        })
                      }
                    >
                      Delete
                    </Button>
                  </div>
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
                  {editingTaskId ? "Edit Task" : "Add New Task"} for {term.name}
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

                        {!showCustomCategoryInput ? (
                          <button
                            type="button"
                            onClick={() => setShowCustomCategoryInput(true)}
                            className="flex items-center py-2 px-3 rounded-full border border-gray-300"
                          >
                            + Custom Category
                          </button>
                        ) : (
                          <div className="flex">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="Enter category name"
                              className="px-3 py-1 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleCustomCategorySubmit}
                              className="px-3 py-1 bg-blue-500 text-white rounded-r-full hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                        )}
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
                      onClick={() => {
                        toggleTaskModal(term.id, false);
                        setEditingTaskId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      {editingTaskId ? "Update Task" : "Save Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this {showDeleteConfirm.type}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm({ type: null, id: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (showDeleteConfirm.type === "term") {
                    handleDeleteTerm(showDeleteConfirm.id);
                  } else {
                    handleDeleteTask(
                      showDeleteConfirm.termId,
                      showDeleteConfirm.id
                    );
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
