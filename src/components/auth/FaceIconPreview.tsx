import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { FaRegSmile, FaUserCircle, FaUserAlt, FaRegIdBadge } from 'react-icons/fa';
import { MdFace, MdTagFaces, MdOutlineFaceRetouchingNatural, MdOutlineFace } from 'react-icons/md';
import { BsPersonBoundingBox, BsPersonCircle, BsPersonSquare } from 'react-icons/bs';
import { HiOutlineUserCircle, HiUser } from 'react-icons/hi';
import { CgProfile } from 'react-icons/cg';
import { RiUserSmileLine, RiUserVoiceLine } from 'react-icons/ri';
import { TbFaceId, TbFaceMask } from 'react-icons/tb';
import { GiAbstract050 } from 'react-icons/gi';

const icons = [
  { name: 'FiCamera', icon: <FiCamera size={40} /> },
  { name: 'FaRegSmile', icon: <FaRegSmile size={40} /> },
  { name: 'FaUserCircle', icon: <FaUserCircle size={40} /> },
  { name: 'FaUserAlt', icon: <FaUserAlt size={40} /> },
  { name: 'FaRegIdBadge', icon: <FaRegIdBadge size={40} /> },
  { name: 'MdFace', icon: <MdFace size={40} /> },
  { name: 'MdTagFaces', icon: <MdTagFaces size={40} /> },
  { name: 'MdOutlineFaceRetouchingNatural', icon: <MdOutlineFaceRetouchingNatural size={40} /> },
  { name: 'MdOutlineFace', icon: <MdOutlineFace size={40} /> },
  { name: 'BsPersonBoundingBox', icon: <BsPersonBoundingBox size={40} /> },
  { name: 'BsPersonCircle', icon: <BsPersonCircle size={40} /> },
  { name: 'BsPersonSquare', icon: <BsPersonSquare size={40} /> },
  { name: 'HiOutlineUserCircle', icon: <HiOutlineUserCircle size={40} /> },
  { name: 'HiUser', icon: <HiUser size={40} /> },
  { name: 'CgProfile', icon: <CgProfile size={40} /> },
  { name: 'RiUserSmileLine', icon: <RiUserSmileLine size={40} /> },
  { name: 'RiUserVoiceLine', icon: <RiUserVoiceLine size={40} /> },
  { name: 'TbFaceId', icon: <TbFaceId size={40} /> },
  { name: 'TbFaceMask', icon: <TbFaceMask size={40} /> },
  { name: 'GiAbstract050', icon: <GiAbstract050 size={40} /> },
];

export function FaceIconPreview() {
  return (
    <Box p={8}>
      <Text fontSize="xl" mb={4} fontWeight="bold">Escolha um ícone para reconhecimento facial:</Text>
      <SimpleGrid columns={[2, 3, 4, 5]} spacing={6}>
        {icons.map((item, idx) => (
          <Box key={item.name} textAlign="center">
            {item.icon}
            <Text fontSize="sm" mt={2}>{idx + 1}. {item.name}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
} 