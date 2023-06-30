import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { Box, Flex, FormControl, FormLabel, Input, Button, Spinner, useToast, Heading, Text } from "@chakra-ui/react";

extend({ OrbitControls });

const Controls = () => {
  const { camera, gl } = useThree();
  return <orbitControls args={[camera, gl.domElement]} />;
};

function Tetrahedron(props) {
  return (
    <mesh {...props}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

function ComplexShape() {
  const group = useRef();
  const color = new THREE.Color(0, 0.5, 0); // Ethereum logo color
  const positions = useMemo(() => JSON.parse(localStorage.getItem('positions')) || [], []);
  const rotations = useMemo(() => JSON.parse(localStorage.getItem('rotations')) || [], []);

  const tetrahedrons = useMemo(() => positions.map((position, i) => 
    <Tetrahedron 
      key={i} 
      position={position} 
      rotation={rotations[i]} 
      color={color}
    />
  ), [color, positions, rotations]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      {tetrahedrons}
    </group>
  );
}

function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const toast = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      const positions = [[0, 0, 0], [0, 0, 0]];
      const rotations = [[0, 0, 0], [0, Math.PI/2, 0]];
      localStorage.setItem('positions', JSON.stringify(positions));
      localStorage.setItem('rotations', JSON.stringify(rotations));

      setTimeout(() => {
        setIsLoading(false);
        setShowModel(true);
        toast({
          title: "Model loaded.",
          description: "Your 3D model has been loaded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 3000); 
    }
  }, [isLoading, toast]);

  return (
    <Flex
      direction="column"
      p={8}
      alignItems="center"
      bgGradient="linear(to-b, white, pink)"
      minHeight="100vh"
    >
      <Heading mb={8}>Nika's NFT 3D Model Generator</Heading>
      <Text mb={4}>Enter your prompt to generate a custom 3D model for your NFT.</Text>

      <Box w="sm">
        <form onSubmit={handleSubmit}>
          <FormControl id="prompt">
            <FormLabel>Enter your prompt</FormLabel>
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              bg="white"
              border="1px solid gray"
              borderRadius="md"
              py={2}
              px={3}
            />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit" w="full">
            Generate
          </Button>
        </form>
      </Box>

      {isLoading && <Spinner mt={4} />}

      {showModel && (
        <Box mt={8} width="100%" height="500px">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Controls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <ComplexShape />
          </Canvas>
        </Box>
      )}
    </Flex>
  );
}

export default App;