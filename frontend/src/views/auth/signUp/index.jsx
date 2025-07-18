import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  
  // State management
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleClick = () => setShow(!show);

// Update the handleSendOtp function in your SignUp component
const handleSendOtp = async () => {
  if (!email) {
    toast({
      title: "Lỗi",
      description: "Vui lòng nhập email",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  setIsSendingOtp(true);
  try {
    // Changed endpoint to /api/auth/send-otp
    await axios.post("http://localhost:8081/api/auth/send-otp", { email });
    setIsOtpSent(true);
    toast({
      title: "OTP đã được gửi",
      description: "Vui lòng kiểm tra email của bạn",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: "Lỗi khi gửi OTP",
      description: error.response?.data?.message || "Có lỗi xảy ra khi gửi OTP",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsSendingOtp(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic validation
  if (password !== confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords don't match",
      status: "error",
    });
    return;
  }

  setIsLoading(true);

  try {
    // 1. First verify OTP
    const otpResponse = await axios.post(
      "http://localhost:8081/api/auth/verify-otp", 
      { email, otp }
    );

    if (!otpResponse.data.success) {
      throw new Error(otpResponse.data.message || "OTP verification failed");
    }

    // 2. Then register user
    const response = await axios.post(
      "http://localhost:8081/api/users/register", // Updated endpoint
      { username, email, password }
    );

    // Handle success
    localStorage.setItem("userToken", response.data.token);
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));

    toast({
      title: "Success",
      description: "Account created successfully!",
      status: "success",
    });

    navigate("/dashboard");

  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    toast({
      title: "Error",
      description: errorMsg,
      status: "error",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Đăng ký
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Tạo tài khoản mới của bạn!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
          as="form"
          onSubmit={handleSubmit}
        >
          <Button
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
            type="button"
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Đăng ký bằng Google
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              hoặc
            </Text>
            <HSeparator />
          </Flex>
          <FormControl>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Tên đăng nhập<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              type="text"
              placeholder="Nhập tên đăng nhập"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Flex mb="24px">
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="Nhập email của bạn"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpSent}
                flex="1"
                mr="10px"
              />
              <Button
                onClick={handleSendOtp}
                isLoading={isSendingOtp}
                disabled={isOtpSent}
                colorScheme="brand"
                size="lg"
              >
                {isOtpSent ? "Đã gửi" : "Gửi OTP"}
              </Button>
            </Flex>

            {isOtpSent && (
              <>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Mã OTP<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  type="text"
                  placeholder="Nhập mã OTP từ email"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </>
            )}

            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Mật khẩu<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md" mb="24px">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder="Mật khẩu ít nhất 8 ký tự"
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>

            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Xác nhận mật khẩu<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md" mb="24px">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder="Nhập lại mật khẩu"
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isLoading}
            >
              Đăng ký
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Đã có tài khoản?
              <NavLink to="/auth/sign-in">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Đăng nhập ngay
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;