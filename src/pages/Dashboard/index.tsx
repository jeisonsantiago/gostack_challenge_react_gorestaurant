import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TODO LOAD FOODS
      const foodList = await api.get('/foods');
      setFoods(foodList.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      const lastIDFromFoods = foods.length;

      const { name, description, price, image } = food;

      // test
      // const imageT = `https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-food/food2.png`;

      // assemble object
      const foodAdd = {
        id: lastIDFromFoods + 1,
        name,
        description,
        price,
        available: true,
        image,
      };

      // console.log(foodAdd);
      // call api and add object
      await api.post('/foods', foodAdd);

      // update list foods
      setFoods(prevFoods => [...prevFoods, foodAdd]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // console.log(editingFood);
    // console.log(food);

    // update food on useState array
    const { name, price, image, description } = food;

    const updatedFood = {
      id: editingFood.id,
      name,
      description,
      price,
      available: editingFood.available,
      image,
    };

    setFoods(currentFoods =>
      currentFoods.map(currentFood =>
        currentFood.id === editingFood.id ? updatedFood : currentFood,
      ),
    );
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    setFoods(currentFoods =>
      currentFoods.filter(currentFood => currentFood.id !== id),
    );
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
