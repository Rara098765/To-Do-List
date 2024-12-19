import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";

export default function App() {
  const [task, setTask] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskValue, setNewTaskValue] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [completion, setCompletion] = useState(0);

  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        value: task,
        image: imageUrl,
        status: "inProgress",
        completion: completion, // сохранение процента при добавлении
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setImageUrl("");
      setCompletion(0); // сброс процента
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((item) => item.id !== taskId));
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
    setCompletion(taskToEdit.completion); // заполняем текущий процент выполнения
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingTask(null);
    setNewTaskValue("");
    setNewImageUrl("");
    setCompletion(0);
  };

  const updateTask = () => {
    if (newTaskValue.trim()) {
      setTasks(
        tasks.map((item) =>
          item.id === editingTask.id
            ? {
                ...item,
                value: newTaskValue,
                image: newImageUrl,
                completion: completion, // обновление процента
              }
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
        <Text style={styles.sliderLabel}>Выполнено: {completion}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={completion}
          onValueChange={setCompletion}
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
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={[styles.taskText, item.status === "completed" && styles.taskCompleted]}>
              {item.value} ({item.completion}%)
            </Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.taskImage} />}
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => changeTaskStatus(item.id, "completed")}>
                <Text style={styles.statusButton}>Выполнено</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTaskStatus(item.id, "inProgress")}>
                <Text style={styles.statusButton}>В процессе</Text>
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
          <Text style={styles.sliderLabel}>Выполнено: {completion}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={completion}
            onValueChange={setCompletion}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={closeEditModal}>
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={updateTask}>
              <Text style={styles.modalButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 15,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    width: "100%",
  },
  sliderLabel: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
  },
  filterActive: {
    backgroundColor: "#4CAF50",
  },
  filterTextActive: {
    color: "#FFF",
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3, // Для Android для эффекта тени
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskImage: {
    width: 40,
    height: 40,
    marginTop: 5,
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statusButton: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  editButton: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  deleteButton: {
    color: "#F44336",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom: 10,
    padding: 5,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
