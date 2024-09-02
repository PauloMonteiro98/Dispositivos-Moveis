import * as React from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [nascimento, setNascimento] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    const loadContacts = async () => {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    };
    loadContacts();
  }, []);

  const addContact = async () => {
    const newContact = { name, phone, email, nascimento, isFavorite };
    const existingContact = contacts.find(contact => contact.email === email);

    if (existingContact) {
      alert('Contato com este email já está adicionado.');
      return;
    }

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));

    setName('');
    setPhone('');
    setEmail('');
    setNascimento('');
    setIsFavorite(false);
  };

  const navigateToContacts = () => {
    navigation.navigate('Contacts', { contacts });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de nascimento"
        value={nascimento}
        onChangeText={setNascimento}
      />
      <View style={styles.switchContainer}>
        <Text>Favorito:</Text>
        <Switch
          value={isFavorite}
          onValueChange={setIsFavorite}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Adicionar Contato" onPress={addContact} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ver Contatos" onPress={navigateToContacts} />
      </View>
    </View>
  );
}

function ContactsScreen({ route }) {
  const contacts = route?.params?.contacts || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.nascimento}>{item.nascimento}</Text>
            <Text style={styles.favorite}>{item.isFavorite ? 'Favorito' : 'Não Favorito'}</Text>
          </View>
        )}
      />
    </View>
  );
}

function FavoritesScreen() {
  const [favorites, setFavorites] = React.useState([]);

  React.useEffect(() => {
    const loadFavorites = async () => {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        const contacts = JSON.parse(storedContacts);
        setFavorites(contacts.filter(contact => contact.isFavorite));
      }
    };
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.nascimento}>{item.nascimento}</Text>
          </View>
        )}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Adicionar Contato' }} />
        <Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Lista de Contatos' }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  nascimento: {
    fontSize: 14,
    color: 'gray',
  },
  favorite: {
    fontSize: 14,
    color: 'green',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
