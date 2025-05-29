import "./Sidebar.css"
import { useAppContext } from "../../Context/AppContext"
import { FaMoneyBillTransfer, FaLightbulb } from "react-icons/fa6";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { IoLogOutOutline, IoMenu, IoHome } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useState } from "react";
import { Loader, Flex, Box, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Sidebar({ mobileExtended, setMobileExtended }) {
	const navigate = useNavigate();
	const location = useLocation();
    const tips = [
    "¿Sabías que Fynkapp predice los pagos de tus clientes con IA?",
    "Agregá clientes nuevos y obtené métricas automáticas.",
    "El resumen mensual se genera solo, ¡sin que hagas nada!",
    "Podés ver quiénes son tus clientes más cumplidores.",
    "Fynkapp aprende del comportamiento de tus clientes."
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

	const {
		width,
		modalsHook: { openAddClientModal },
		authHook: { loginData, logoutUser }
	} = useAppContext();

	const [isClosing, setIsClosing] = useState(false);
	const handleLogout = async () => {
		setIsClosing(true);
		await logoutUser();
		setIsClosing(false);
	};

	return (
		<Box className='sidebar-container'>
			{width > 768 ? (
				<Flex direction="column" className='sidebar'>

					<Box className="logout-button" onClick={handleLogout} >
						{isClosing
							? <Loader size={20} type="dots" color="black" />
							: <IoLogOutOutline size={20} color="black" />
						}
					</Box>

					<Text className='sidebar-logo' size={"1.5rem"} fw={700}>Fynkapp <FaMoneyBillTransfer /></Text>

					<Flex align="center" gap="sm" mb="md" className="sidebar-user-box">
						<FaUserCircle size={30} />
						<Text fw={500}>Hola, {loginData?.user_name?.split(" ")[0] || "Usuario"} 👋</Text>
					</Flex>

					<Box
						className='sidebar-list'
						onClick={() => {
							openAddClientModal();
							setMobileExtended(false);
						}}
					>
						<MdOutlinePersonAddAlt1 size={20} /> <span>Agregar cliente</span>
					</Box>

					<Box className="sidebar-divider" />

					<Box
						className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
						onClick={() => navigate("/")}
					>
						<IoHome size={20} /> Inicio
					</Box>
					<Box
						className={`sidebar-list ${location.pathname === "/monthly-resume" ? "active" : ""}`}
						onClick={() => navigate("/monthly-resume")}
					>
						<HiOutlineDocumentReport size={20} /> <span>Resumen mensual</span>
					</Box>

					<Box className="sidebar-divider" />

					<Flex className="sidebar-tip-box" gap="xs">
                    <FaLightbulb color="#facc15" />
                    <Text fz="xs" c="dark">Tip: {randomTip}</Text>
                    </Flex>

				</Flex>
			) : (
				<Box className={`sidebar-mobile ${mobileExtended ? "extended" : ""}`}>
					<Text className='sidebar-logo' mt={5} fw={500}>
						Hola, {loginData.user_name.split(" ")[0] || "Usuario"} 👋
					</Text>

					<Flex align="center" justify="space-between" px="sm" mt={5}>
						<Box className="sidebar-menu-icon" onClick={() => setMobileExtended(!mobileExtended)}>
							<IoMenu size={20} />
						</Box>
						<Box className="sidebar-menu-icon logout" onClick={() => handleLogout()}>
							{isClosing
								? <Loader size={20} color="#2c2c2c" type="dots" />
								: <IoLogOutOutline size={20} />
							}
						</Box>
					</Flex>

					<Flex direction="column" className='sidebar-mobile-list'>
						{width <= 768 && (
							<>
								<Box className='sidebar-list' onClick={() => {
									openAddClientModal();
									setMobileExtended(false);
								}}>
									<MdOutlinePersonAddAlt1 size={20} /> <span>Agregar cliente</span>
								</Box>

								<Box
									className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
									onClick={() => {
										navigate("/");
										setMobileExtended(false);
									}}
								>
									<IoHome size={20} /> Inicio
								</Box>

								<Box
									className={`sidebar-list ${location.pathname === "/monthly-resume" ? "active" : ""}`}
									onClick={() => {
										navigate("/monthly-resume");
										setMobileExtended(false);
									}}
								>
									<HiOutlineDocumentReport size={20} /> <span>Resumen mensual</span>
								</Box>
							</>
						)}
					</Flex>
				</Box>
			)}
		</Box>
	);
}

export default Sidebar;
