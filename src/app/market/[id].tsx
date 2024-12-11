import { useEffect, useState, useRef } from "react"
import { View, Alert, Modal, StatusBar, ScrollView } from "react-native"
import { router, useLocalSearchParams, Redirect } from "expo-router"
import { useCameraPermissions, CameraView } from "expo-camera"

import { Details, PropsDetails } from "@/components/market/details";
import { Cover } from "@/components/market/cover";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

import { api } from "@/services/api"

type DataProps = PropsDetails & {
    cover: string
}

export default function Market() {
    const [data, setData] = useState<DataProps>()
    const [coupon, setCoupon] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [couponIsFetching, setCouponIsFetching] = useState(false)
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)

    const [_, requestPermission] = useCameraPermissions()
    const params = useLocalSearchParams<{ id: string }>()

    const qrLock = useRef(false)
    console.log(params.id)

    async function fetchMarket() {
        try {
            const { data } = await api.get(`/markets/${params.id}`)
            setData(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível carregar os dados", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ])
        }
    }

    async function handleOpenCamera() {
        try {
          const { granted } = await requestPermission()
          if (!granted) {
            return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera")
          }
          qrLock.current = false
          setIsVisibleCameraModal(true)
        } catch (error) {
          console.log(error)
          Alert.alert("Câmera", "Não foi possível utilizar a câmera")
        }
      }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if (!data) {
        return <Redirect href="/home" />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover} />
                <Details data={data} />
                {coupon && <Coupon code={coupon} />}
            </ScrollView>

            <View style={{ padding: 32 }}>
                <Button onPress={handleOpenCamera}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>
        </View>
    )
}