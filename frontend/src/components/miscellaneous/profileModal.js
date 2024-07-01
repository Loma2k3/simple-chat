import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  MenuItem,
} from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div>
            {children ? (<MenuItem onClick={onOpen}>{children}</MenuItem>) : (<div></div>)}

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent margin="auto">
                    <ModalHeader color='black' fontSize="40px" textAlign="center">{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color='black' display="flex"
                        flexDirection="column" alignItems="center">
                        <Image
                            borderRadius='full'
                            boxSize='250px'
                            src={user.pic}
                            alt={user.name}
                        />

                        <Text fontSize='3xl'>{user.email}</Text>

                    </ModalBody>

                    <ModalFooter >
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal