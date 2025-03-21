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
    { id: "language", name: "语言考试", color: "#bce7fd" }, // 保持原有的浅蓝色
    { id: "gpa", name: "GPA", color: "#b0db43" }, // 保持原有的青柠绿
    { id: "course", name: "选课", color: "#a8e6cf" }, // 清新的薄荷绿
    { id: "resume", name: "简历", color: "#ffd3b6" }, // 保持原有的浅紫色
    { id: "recommendation", name: "推荐信", color: "#ffb5e8" }, // 柔和的粉色
    { id: "interview", name: "模拟面试", color: "#dcd3ff" }, // 淡雅的薰衣草紫
    { id: "practice", name: "实习/科研/海外交换", color: "#db2763" }, // 保持原有的玫红色
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

  // Overall planning state
  const [overallPlan, setOverallPlan] = useState({
    items: [],
    showAddForm: false,
    newItem: { category: "", summary: "", startDate: null, dueDate: null },
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
          newTask: {
            category: "",
            summary: "",
            startDate: null,
            dueDate: null,
          },
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

  // 为 term tasks 添加处理开始日期的函数
  const handleStartDateChange = (termId, date) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === termId
          ? {
              ...term,
              newTask: { ...term.newTask, startDate: date },
            }
          : term
      )
    );
  };

  // 为 overall tasks 添加处理开始日期的函数
  const handleOverallStartDateChange = (date) => {
    setOverallPlan({
      ...overallPlan,
      newItem: { ...overallPlan.newItem, startDate: date },
    });
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

  // Overall plan task handlers
  const toggleOverallTaskModal = (show) => {
    setOverallPlan({
      ...overallPlan,
      showAddForm: show,
      newItem: show
        ? { category: "", summary: "", dueDate: null }
        : overallPlan.newItem,
    });
  };

  const handleOverallTaskInputChange = (e) => {
    const { name, value } = e.target;
    setOverallPlan({
      ...overallPlan,
      newItem: { ...overallPlan.newItem, [name]: value },
    });
  };

  const handleOverallDateChange = (date) => {
    setOverallPlan({
      ...overallPlan,
      newItem: { ...overallPlan.newItem, dueDate: date },
    });
  };

  const handleOverallCategorySelect = (categoryId) => {
    setOverallPlan({
      ...overallPlan,
      newItem: { ...overallPlan.newItem, category: categoryId },
    });
  };

  const handleOverallTaskSubmit = (e) => {
    e.preventDefault();
    if (overallPlan.newItem?.category && overallPlan.newItem?.summary) {
      if (editingTaskId) {
        // Update existing task
        setOverallPlan({
          ...overallPlan,
          items: overallPlan.items.map((item) =>
            item.id === editingTaskId
              ? { ...overallPlan.newItem, id: item.id }
              : item
          ),
          showAddForm: false,
          newItem: { category: "", summary: "", dueDate: null },
        });
      } else {
        // Add new task
        setOverallPlan({
          ...overallPlan,
          items: [
            ...overallPlan.items,
            { ...overallPlan.newItem, id: Date.now() },
          ],
          showAddForm: false,
          newItem: { category: "", summary: "", dueDate: null },
        });
      }
      setEditingTaskId(null);
    }
  };

  const handleEditOverallTask = (task) => {
    setEditingTaskId(task.id);
    setOverallPlan({
      ...overallPlan,
      showAddForm: true,
      newItem: { ...task },
    });
  };

  const handleDeleteOverallTask = (taskId) => {
    setOverallPlan({
      ...overallPlan,
      items: overallPlan.items.filter((item) => item.id !== taskId),
    });
    setShowDeleteConfirm({ type: null, id: null });
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
              + 添加新阶段
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
            生成规划报告
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              /* 添加Email功能 */
            }}
          >
            <Mail className="w-4 h-4" />
            发送模板邮件
          </Button>
        </div>
      </div>

      {/* Overall Planning Section */}
      <div className="mb-16 border-t pt-8">
        <h1 className="text-3xl font-bold text-primary mb-10">总体规划</h1>

        {/* Task Headers */}
        <div className="mb-6">
          <div className="flex">
            <div className="flex-1 text-2xl">类别</div>
            <div className="flex-2 text-2xl gap-8">任务描述</div>
            <div className="flex-1 text-2xl">开始日期</div>
            <div className="flex-1 text-2xl">截止日期</div>
            <div className="w-[200px]"></div>
          </div>
        </div>

        {/* Overall plan tasks list */}
        {overallPlan.items.length > 0 && (
          <div className="mb-8">
            {overallPlan.items.map((task) => (
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
                <div className="flex-2 gap-8 whitespace-pre-wrap">
                  {task.summary}
                </div>
                <div className="flex-1">
                  {task.startDate ? `🗓️ ${formatDate(task.startDate)}` : ""}
                </div>
                <div className="flex-1">
                  {task.dueDate ? `🗓️ ${formatDate(task.dueDate)}` : ""}
                </div>
                <div className="flex gap-2 w-[200px]">
                  <Button
                    variant="outline"
                    className="border-primary text-primary"
                    onClick={() => handleEditOverallTask(task)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary"
                    onClick={() =>
                      setShowDeleteConfirm({
                        type: "overall-task",
                        id: task.id,
                      })
                    }
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Button */}
        <button
          onClick={() => toggleOverallTaskModal(true)}
          className="px-4 py-2 text-xl text-secondary hover:bg-gray-100"
        >
          + 添加任务
        </button>
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
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() =>
                        setShowDeleteConfirm({ type: "term", id: term.id })
                      }
                    >
                      删除
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Task Headers */}
          <div className="mb-6">
            <div className="flex">
              <div className="flex-1 text-2xl">类别</div>
              <div className="flex-2 text-2xl gap-8">任务描述</div>
              <div className="flex-1 text-2xl">开始日期</div>
              <div className="flex-1 text-2xl">截止日期</div>
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
                  <div className="flex-2 gap-8 whitespace-pre-wrap">
                    {task.summary}
                  </div>
                  <div className="flex-1">
                    {task.startDate ? `🗓️ ${formatDate(task.startDate)}` : ""}
                  </div>
                  <div className="flex-1">
                    {task.dueDate ? `🗓️ ${formatDate(task.dueDate)}` : ""}
                  </div>
                  <div className="flex gap-2 w-[200px]">
                    <Button
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() => handleEditTask(term.id, task)}
                    >
                      编辑
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
                      删除
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
            + 添加任务
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
                        类别
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
                            + 自定义类别
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
                              添加
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        任务描述
                      </label>
                      <textarea
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
                        开始日期（可选）
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {term.newTask?.startDate ? (
                              formatDate(term.newTask.startDate)
                            ) : (
                              <span>选择日期</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={term.newTask?.startDate}
                            onSelect={(date) =>
                              handleStartDateChange(term.id, date)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        截止日期（可选）
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
                              <span>选择日期</span>
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

      {/* Overall Task Modal */}
      {overallPlan.showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingTaskId ? "Edit Task" : "Add New Task"} for 总体规划
            </h2>

            <form onSubmit={handleOverallTaskSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    类别
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className={`flex items-center py-2 px-3 rounded-full border ${
                          overallPlan.newItem?.category === category.id
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleOverallCategorySelect(category.id)}
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
                        + 自定义类别
                      </button>
                    ) : (
                      <div className="flex">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                          className="px-3 py-1 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleCustomCategorySubmit}
                          className="px-3 py-1 bg-blue-500 text-white rounded-r-full hover:bg-blue-600"
                        >
                          添加
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    任务描述
                  </label>
                  <textarea
                    type="text"
                    name="summary"
                    value={overallPlan.newItem?.summary || ""}
                    onChange={handleOverallTaskInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期（可选）
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {overallPlan.newItem?.startDate ? (
                          formatDate(overallPlan.newItem.startDate)
                        ) : (
                          <span>选择日期</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={overallPlan.newItem?.startDate}
                        onSelect={handleOverallStartDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期（可选）
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {overallPlan.newItem?.dueDate ? (
                          formatDate(overallPlan.newItem.dueDate)
                        ) : (
                          <span>选择日期</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={overallPlan.newItem?.dueDate}
                        onSelect={handleOverallDateChange}
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
                    toggleOverallTaskModal(false);
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this{" "}
              {showDeleteConfirm.type === "overall-task"
                ? "task"
                : showDeleteConfirm.type}
              ? This action cannot be undone.
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
                  } else if (showDeleteConfirm.type === "overall-task") {
                    handleDeleteOverallTask(showDeleteConfirm.id);
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
