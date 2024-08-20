import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Image } from 'react-native';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  useEffect(() => {
    const filteredList = registros.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  }, [search, registros]);

  const fetchAllPokemons = async () => {
    let allPokemons = [];
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=1000'; // Ajuste o limite se necessário

    while (url) {
      const response = await fetch(url);
      const data = await response.json();
      allPokemons = allPokemons.concat(data.results);
      url = data.next; // URL da próxima página
    }

    setRegistros(allPokemons);
  };

  const fetchPokemonDetails = async (name) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    setPokemon(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        style={styles.input}
        placeholder="Procure um Pokémon"
        placeholderTextColor="#dcdcdc"
        value={search}
        onChangeText={(text) => setSearch(text)}
        onSubmitEditing={() => {
          const filteredList = registros.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredPokemonList(filteredList);
        }}
      />
      <FlatList
        data={filteredPokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name.toUpperCase()}</Text>
            <Button title="Ver Detalhes" onPress={() => fetchPokemonDetails(item.name)} color="#ffffff" />
          </View>
        )}
      />
      {pokemon && (
        <View style={styles.pokemonDetails}>
          <Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text>
          <Image
            style={styles.pokemonImage}
            
            source={{ uri: pokemon.sprites.front_default }}   
          />
                    <Image
            style={styles.pokemonImage}
            
            source={{ uri: pokemon.sprites.back_default }}
          />
          <Text style={styles.detailText}>Altura: {pokemon.height / 10} m</Text>
          <Text style={styles.detailText}>Peso: {pokemon.weight / 10} kg</Text>
          <Text style={styles.detailHeading}>Tipos:</Text>
          {pokemon.types.map((typeInfo) => (
            <Text key={typeInfo.type.name} style={styles.detailText}>- {typeInfo.type.name}</Text>
          ))}
          <Text style={styles.detailHeading}>Habilidades:</Text>
          {pokemon.abilities.map((abilityInfo) => (
            <Text key={abilityInfo.ability.name} style={styles.detailText}>- {abilityInfo.ability.name}</Text>
          ))}
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d28d9', // Roxo escuro para o fundo
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#ffffff', // Texto branco para contraste
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8a2d6', // Roxo claro para a borda
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#6d28d9', // Texto roxo escuro
  },
  itemContainer: {
    backgroundColor: '#ffffff', // Fundo branco para os cards
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6d28d9', // Texto roxo escuro para os nomes dos Pokémon
  },
  pokemonDetails: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fundo branco para a seção de detalhes
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d28d9', // Texto roxo escuro
    marginBottom: 10,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#6d28d9', // Texto roxo escuro para detalhes
  },
  detailHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6d28d9', // Texto roxo escuro para cabeçalhos
    marginTop: 10,
  },
});
