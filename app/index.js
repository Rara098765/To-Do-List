import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Modal, Button, Alert, Image } from "react-native";

export default function App() {
  const [task, setTask] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskValue, setNewTaskValue] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        value: task,
        completed: false,
        image: imageUrl,
        status: "inProgress",
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setImageUrl("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((item) => item.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((item) =>
        item.id === taskId ? { ...item, status: newStatus } : item
      )
    );
  };

  const openEditModal = (taskId) => {
    const taskToEdit = tasks.find((item) => item.id === taskId);
    setEditingTask(taskToEdit);
    setNewTaskValue(taskToEdit.value);
    setNewImageUrl(taskToEdit.image);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingTask(null);
    setNewTaskValue("");
    setNewImageUrl("");
  };

  const updateTask = () => {
    if (newTaskValue.trim()) {
      setTasks(
        tasks.map((item) =>
          item.id === editingTask.id
            ? { ...item, value: newTaskValue, image: newImageUrl }
            : item
        )
      );
      closeEditModal();
    } else {
      Alert.alert("Ошибка", "Задача не может быть пустой");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "active") return task.status === "inProgress";
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Список задач</Text>

      {/* Ввод задачи и изображения */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите задачу..."
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Введите URL изображения (необязательно)"
          value={imageUrl}
          onChangeText={(url) => setImageUrl(url)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {/* Фильтры */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={filter === "all" && styles.filterTextActive}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "active" && styles.filterActive]}
          onPress={() => setFilter("active")}
        >
          <Text style={filter === "active" && styles.filterTextActive}>Активные</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "completed" && styles.filterActive]}
          onPress={() => setFilter("completed")}
        >
          <Text style={filter === "completed" && styles.filterTextActive}>Выполненные</Text>
        </TouchableOpacity>
      </View>

      {/* Список задач */}
      <View style={styles.taskSection}>
        <Text style={styles.sectionTitle}>Задачи</Text>
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity onPress={() => toggleTaskStatus(item.id)}>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.taskCompleted,
                    item.status === "completed" && styles.statusCompleted,
                    item.status === "inProgress" && styles.statusInProgress,
                    item.status === "cancelled" && styles.statusCancelled,
                  ]}
                >
                  {item.value}
                </Text>
              </TouchableOpacity>

              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.taskImage} />
              ) : null}

              <View style={styles.taskActions}>
                <TouchableOpacity
                  onPress={() => changeTaskStatus(item.id, "completed")}
                >
                  <Text style={styles.statusButton}>Выполнено</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => changeTaskStatus(item.id, "cancelled")}
                >
                  <Text style={styles.statusButton}>Отменено</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEditModal(item.id)}>
                  <Text style={styles.editButton}>Редактировать</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Text style={styles.deleteButton}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Модальное окно редактирования */}
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Редактировать задачу</Text>
          <TextInput
            style={styles.modalInput}
            value={newTaskValue}
            onChangeText={setNewTaskValue}
            placeholder="Введите новое значение задачи"
          />
          <TextInput
            style={styles.modalInput}
            value={newImageUrl}
            onChangeText={setNewImageUrl}
            placeholder="Введите новый URL изображения"
          />
          <View style={styles.modalButtons}>
            <Button title="Отмена" onPress={closeEditModal} />
            <Button title="Сохранить" onPress={updateTask} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4caf50",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  filterActive: {
    backgroundColor: "#4caf50",
  },
  filterTextActive: {
    color: "#fff",
  },
  taskSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  taskText: {
    fontSize: 18,
    color: "#333",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  statusCompleted: {
    color: "green",
  },
  statusInProgress: {
    color: "orange",
  },
  statusCancelled: {
    color: "red",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statusButton: {
    color: "#4CAF50",
  },
  editButton: {
    color: "#FF9800",
  },
  deleteButton: {
    color: "#F44336",
  },
  taskImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: "#FFF",
  },
  modalInput: {
    width: "80%",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
});
