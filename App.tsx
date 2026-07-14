import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Controller, useForm } from 'react-hook-form';

type TaskForm = {
  name: string;
  description: string;
};

export default function App() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function createTask(data: TaskForm) {
    Alert.alert('Task created!', data.name);

    console.log(data);

    reset();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>To</Text>day
        </Text>

        <Text style={styles.subtitle}>
          Wake up, go ahead, do the thing not tomorrow, do today.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add new to-do</Text>

          <Text style={styles.label}>Task name:</Text>

          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Type the task name.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Placeholder..."
                placeholderTextColor="#888888"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          {errors.name && (
            <Text style={styles.errorText}>
              {errors.name.message}
            </Text>
          )}

          <Text style={styles.label}>Task description:</Text>

          <Controller
            control={control}
            name="description"
            rules={{
              required: 'Type the task description.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Placeholder..."
                placeholderTextColor="#888888"
                multiline
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          {errors.description && (
            <Text style={styles.errorText}>
              {errors.description.message}
            </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(createTask)}
          >
            <Text style={styles.buttonText}>Create to-do</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>To-do</Text>

          <Text style={styles.emptyText}>
            Your tasks will appear here.
          </Text>
        </View>

        <View style={styles.counterCard}>
          <Text style={styles.counterTitle}>
            Finished tasks quantity
          </Text>

          <Text style={styles.counterNumber}>00</Text>
        </View>

        <View style={styles.quoteArea}>
          <Text style={styles.quote}>
            “Motivational Chuck Norris Phrase”
          </Text>

          <Text style={styles.author}>By Chuck Norris.</Text>
        </View>

        <Text style={styles.footer}>
          @Did from by ♥ Rafa ♥
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },

  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '400',
  },

  titleBold: {
    fontWeight: '700',
  },

  subtitle: {
    color: '#BEBEBE',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#3E3E3E',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  label: {
    color: '#D8D8D8',
    fontSize: 11,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#494949',
    color: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 12,
  },

  descriptionInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  errorText: {
    color: '#FFA5A5',
    fontSize: 10,
    marginTop: -7,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 2,
  },

  buttonText: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyText: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 18,
  },

  counterCard: {
    backgroundColor: '#3E3E3E',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 16,
  },

  counterTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  counterNumber: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '600',
    marginTop: 3,
  },

  quoteArea: {
    marginTop: 4,
  },

  quote: {
    color: '#BEBEBE',
    fontSize: 10,
    fontStyle: 'italic',
  },

  author: {
    color: '#FFFFFF',
    fontSize: 9,
    marginTop: 6,
  },

  footer: {
    color: '#999999',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 45,
  },
});