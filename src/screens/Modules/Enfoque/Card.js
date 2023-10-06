import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Button, Linking } from 'react-native';
import Modal from 'react-native-modal';

import {
    Center,
    Box,
    Input,
    ScrollView,
    Stack,
    Checkbox,
    VStack,
    Link,
    Flex
} from 'native-base';

import uuid from 'react-native-uuid';

import { useUser } from '../../../context/User';

import { Formik } from 'formik';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/app';


const Card = ({ title, subtitle, imageUrl, onPress, link, idProducto }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user, userInfo, userTier } = useUser();
    const submitApplication = async (values) => {
        try {

            console.log(values)
            const today = new Date();
            if (
                values.email === '' ||
                values.numero === '' ||
                values.edad === '' ||
                values.reason === '' ||
                values.socialmedia === '' ||
                values.requirements === ''
            ) {
                Alert.alert('Aviso', 'Por favor, rellena los campos.');
            } else if (!values.numero.match(/^[0-9]*$/)) {
                Alert.alert('Aviso', 'Debe ser númerico');
            } else {
                console.log(idProducto);
                var uuidProduct = uuid.v4();
                await firestore().collection('applications').doc(uuidProduct).set({
                    id: uuidProduct,
                    idProduct: idProducto,
                    email: values.email,
                    numero: values.numero,
                    edad: values.edad,
                    reason: values.reason,
                    socialmedia: values.socialmedia,
                    requirements: values.requirements,
                    fecha: today,
                });
                setModalVisible(false)
                Alert.alert('Registro exitoso', 'Por favor, mantente al pendiente de tus medios de contacto.');
            }

        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert('Error', 'Hubo un problema al registrar la solicitud. Por favor, intenta de nuevo.');
        }
    };

    return (
        <View style={styles.cardContainer}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />

            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text numberOfLines={5} style={styles.cardSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.cardButtonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (link) {
                            Linking.openURL(link);
                        } else {
                            Alert.alert("Aviso", "Para este reto no hay link disponible");
                        }
                    }}
                    style={styles.cardButton}
                >
                    <Text style={styles.buttonText}>Más información</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={[styles.cardButton, styles.secondButton]}
                >
                    <Text style={styles.buttonText}>Aplicar</Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={modalVisible}
                style={{
                    borderRadius: 8,
                }}
                visible={modalVisible}
                onBackdropPress={() => setModalVisible(!modalVisible)}>

                <Center w="100%">
                    <Box
                        w="90%"
                        bg="rgba(255, 255, 255, 1)"
                        mb={5}
                        pb={5}
                        shadow="9"
                        rounded="12">
                        <View>
                            <View style={{ padding: 25 }}>
                                <Text style={styles.modalText}>Aplicar para recompensa</Text>

                                <ScrollView>
                                    <Formik
                                        initialValues={{
                                            nombre: '',
                                            numero: '',
                                            edad: '',
                                            reason: '',
                                            requirements: '',
                                            socialmedia: ''
                                        }}
                                        //validationSchema={SignUpSchema}
                                        onSubmit={async (values) => {
                                            console.log(values);
                                            submitApplication(values);
                                        }}>
                                        {({
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            setFieldValue,
                                            values,
                                            errors,
                                            touched,
                                        }) => (
                                            <View>

                                                <Input
                                                    placeholder="Correo electrónico"
                                                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                                                    onChangeText={handleChange('email')}
                                                    value={values.email}
                                                    onBlur={handleBlur('email')}
                                                    w="100%"
                                                    size="2xl"
                                                    borderColor="#475BD8"
                                                    rounded="8"
                                                    mb="3"
                                                    _focus={{
                                                        borderColor: '#475BD8',
                                                    }}
                                                    InputLeftElement={
                                                        <MaterialCommunityIcon
                                                            name="email-outline"
                                                            style={styles.email_input}
                                                            size={32}
                                                            color="rgba(5, 24, 139, 0.8)"
                                                        />
                                                    }
                                                />

                                                <Input
                                                    placeholder="Número de teléfono"
                                                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                                                    onChangeText={handleChange('numero')}
                                                    value={values.numero}
                                                    onBlur={handleBlur('numero')}
                                                    w="100%"
                                                    size="2xl"
                                                    borderColor="#475BD8"
                                                    rounded="8"
                                                    _focus={{
                                                        borderColor: '#475BD8',
                                                    }}
                                                    mb="3"
                                                    keyboardType="numeric"
                                                    InputLeftElement={
                                                        <MaterialCommunityIcon
                                                            name="phone"
                                                            style={styles.email_input}
                                                            size={32}
                                                            color="rgba(5, 24, 139, 0.8)"
                                                        />
                                                    }
                                                />

                                                <Input
                                                    placeholder="Redes sociales"
                                                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                                                    onChangeText={handleChange('socialmedia')}
                                                    value={values.socialmedia}
                                                    onBlur={handleBlur('socialmedia')}
                                                    w="100%"
                                                    size="2xl"
                                                    borderColor="#475BD8"
                                                    rounded="8"
                                                    mb="3"
                                                    _focus={{
                                                        borderColor: '#475BD8',
                                                    }}
                                                    InputLeftElement={
                                                        <MaterialCommunityIcon
                                                            name="wan"
                                                            style={styles.email_input}
                                                            size={32}
                                                            color="rgba(5, 24, 139, 0.8)"
                                                        />
                                                    }
                                                />


                                                <Input
                                                    placeholder="Edad"
                                                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                                                    onChangeText={handleChange('edad')}
                                                    value={values.edad}
                                                    onBlur={handleBlur('edad')}
                                                    w="100%"
                                                    size="2xl"
                                                    borderColor="#475BD8"
                                                    rounded="8"
                                                    _focus={{
                                                        borderColor: '#475BD8',
                                                    }}
                                                    mb="3"
                                                    keyboardType="numeric"
                                                    InputLeftElement={
                                                        <MaterialCommunityIcon
                                                            name="account"
                                                            style={styles.email_input}
                                                            size={32}
                                                            color="rgba(5, 24, 139, 0.8)"
                                                        />
                                                    }
                                                />


                                                <Input
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    maxLength={150}
                                                    placeholder="Por qué deberías ganar"
                                                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                                                    onChangeText={handleChange('reason')}
                                                    value={values.reason}
                                                    onBlur={handleBlur('reason')}
                                                    w="100%"
                                                    size="2xl"
                                                    borderColor="#475BD8"
                                                    rounded="8"
                                                    mb={2}
                                                    _focus={{
                                                        borderColor: '#475BD8',
                                                    }}
                                                />
                                                <Text color="grey">
                                                    Longitud Máxima 130
                                                </Text>
                                                <Stack direction="row" alignItems="center" mt={4} ml={4} w="100%" mb={5}>
                                                    <Box justifyContent="center">
                                                        <Checkbox
                                                            size="lg"
                                                            colorScheme="info"
                                                            accessibilityLabel="This is a dummy checkbox"
                                                            mb={2}
                                                            isChecked={values.requirements}
                                                            onChange={(e) => {
                                                                setFieldValue('requirements', !values.requirements);
                                                            }}
                                                        />
                                                    </Box>
                                                    <Link
                                                        ml={2}
                                                        mb={2}
                                                        _text={{
                                                            fontSize: 18,
                                                            color: '#272C46',
                                                        }}>
                                                        Cumplí los requisitos
                                                    </Link>
                                                </Stack>





                                                <TouchableOpacity
                                                    onPress={handleSubmit}
                                                    style={[styles.cardButton, styles.thirdButton]}
                                                >
                                                    <Text style={styles.buttonText}>Confirmar</Text>
                                                </TouchableOpacity>


                                            </View>
                                        )}
                                    </Formik>

                                </ScrollView>
                            </View>
                        </View>
                    </Box>
                </Center>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 5,
        elevation: 3, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
    cardTextContainer: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 10,
        overflow: 'hidden',
    },
    cardButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    cardButton: {
        backgroundColor: '#2f89fc',
        color: 'white',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    secondButton: {
        marginLeft: 10,
        backgroundColor: '#17b978',
    },
    thirdButton: {
        backgroundColor: '#17b978',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 23,
    }

});

export default Card;
