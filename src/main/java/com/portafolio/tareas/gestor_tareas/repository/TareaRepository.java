package com.portafolio.tareas.gestor_tareas.repository;

import com.portafolio.tareas.gestor_tareas.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
}
