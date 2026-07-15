import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Task } from '../types/Task';

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function TaskItem({
  task,
  onDelete,
}: TaskItemProps) {
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskTextArea}>
        <Text style={styles.taskName}>
          {task.name}
        </Text>

        <Text style={styles.taskDescription}>
          {task.description}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteButtonText}>
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#494949',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  taskTextArea: {
    flex: 1,
    marginRight: 10,
  },

  taskName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  taskDescription: {
    color: '#C5C5C5',
    fontSize: 10,
    lineHeight: 14,
  },

  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
});