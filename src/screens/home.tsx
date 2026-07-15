import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Controller, useForm } from 'react-hook-form'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useQuery } from '@tanstack/react-query';
import TaskItem from '../components/TaskItem';
import { getChuckNorrisJoke } from '../services/chuckNorrisApi';
import { Task, TaskForm } from '../types/Task';

//as chaves de salvar e contar as atvs
const TASKS_STORAGE_KEY = '@today_tasks'; 
const FINISHED_STORAGE_KEY = '@today_finished_tasks'; 

export default function Home() {
  // Guarda a lista de tarefas e a quantidade de tarefas finalizadas
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [finishedTasks, setFinishedTasks] = useState(0); 

  // controle do formulario, valida, limpa os campos depois de criados
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

  //frase da api a cada 5s
  const {
    data: jokeData,
    isPending: isJokeLoading,
    isError: isJokeError,
  } = useQuery({
    queryKey: ['chuckNorrisJoke'],
    queryFn: getChuckNorrisJoke,
    refetchInterval: 5000,
  });

  // carrega os dados qnd a tela abre
  useEffect(() => {
    loadSavedData();
  }, []);

  
  async function loadSavedData() {
    try {
      const savedTasks = await AsyncStorage.getItem(
        TASKS_STORAGE_KEY
      );

      const savedFinishedTasks = await AsyncStorage.getItem(
        FINISHED_STORAGE_KEY
      );

      if (savedTasks) {
        const convertedTasks: Task[] = JSON.parse(savedTasks);

        setTasks(convertedTasks);
      }

      if (savedFinishedTasks) {
        setFinishedTasks(Number(savedFinishedTasks));
      }
    } catch (error) {
      console.log('Error loading saved data:', error);
    }
  }

  // cria uma tarefa, atualiza e salva no celular
  async function createTask(data: TaskForm) {
    const newTask: Task = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
    };

    const updatedTasks = [...tasks, newTask];

    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(updatedTasks) 
      );
    } catch (error) {
      console.log('Error saving task:', error);
    }

    reset();
  }

  //deleta uma tarefa e adiciona no contador +1 atividade finalizada
  async function deleteTask(id: string) {
    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    const updatedFinishedTasks = finishedTasks + 1;

    setTasks(updatedTasks);
    setFinishedTasks(updatedFinishedTasks);

    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(updatedTasks)
      );

      await AsyncStorage.setItem(
        FINISHED_STORAGE_KEY,
        updatedFinishedTasks.toString()
      );
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  }

  //mensagens da api
  function showChuckNorrisPhrase() {
    if (isJokeLoading) {
      return 'Loading Chuck Norris phrase...';
    }

    return jokeData?.value || 'Chuck Norris is thinking...';
  }



  return (
    <View style={styles.container}> 

      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        {/*logo e titulo*/}
        <View style={styles.titleArea}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            <Text style={styles.titleBold}>To</Text>day
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Wake up, go ahead, do the thing not tomorrow, do today.
        </Text>

{/*formulario*/}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Add new to-do
          </Text>

          <Text style={styles.label}>
            Task name:
          </Text>

{/*une o campo de nome com react hook form*/}
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

          <Text style={styles.label}>
            Task description:
          </Text>
{/*une o campo de descrição com o react hook form*/}
          <Controller
            control={control}
            name="description"
            rules={{
              required: 'Type the task description.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                ]}
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
{/*botao para validar e criar a tarefa*/}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(createTask)}
          >
            <Text style={styles.buttonText}>
              Create to-do
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            To-do
          </Text>

          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>
              Your tasks will appear here.
            </Text>
          ) : (
            <ScrollView
              style={styles.taskList}
              nestedScrollEnabled
            >

              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                />
              ))}
            </ScrollView>
          )}
        </View>

{/*qntd de tarefas removidas (concluidas)*/}
        <View style={styles.counterCard}>
          <Text style={styles.counterTitle}>
            Finished tasks quantity
          </Text>
          <Text style={styles.counterNumber}>
            {finishedTasks
              .toString()
              .padStart(2, '0')} 
          </Text>
        </View>

{/*frases*/}
        <View style={styles.quoteArea}>
          <Text style={styles.quote}>
            “{showChuckNorrisPhrase()}”
          </Text>

          <Text style={styles.author}>
            By Chuck Norris.
          </Text>
        </View>

        <Text style={styles.footer}>
          Did with ♥ by Rafaela
        </Text>
      </ScrollView>
    </View>
  );
}

//estilos da tela
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

  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
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
    marginTop: 6,
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

  taskList: {
    maxHeight: 230,
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
    minHeight: 65,
    marginTop: 4,
  },

  quote: {
    color: '#BEBEBE',
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 15,
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